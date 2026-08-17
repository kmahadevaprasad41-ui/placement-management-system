import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Only Placement Officers can override eligibility." }, { status: 403 });
    }

    const { studentId, jobId, reason } = await req.json();

    if (!studentId || !jobId || !reason || reason.trim().length < 5) {
      return NextResponse.json({ error: "Student ID, Job ID, and a mandatory detailed justification reason (min 5 chars) are required." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!student || !job) {
      return NextResponse.json({ error: "Student or Job not found" }, { status: 404 });
    }

    const override = await prisma.eligibilityOverride.upsert({
      where: {
        studentId_jobId: { studentId, jobId },
      },
      create: {
        studentId,
        jobId,
        overriddenById: user.id,
        previousResult: "NOT_ELIGIBLE",
        newResult: "OVERRIDDEN_ELIGIBLE",
        reason: reason.trim(),
      },
      update: {
        overriddenById: user.id,
        reason: reason.trim(),
        createdAt: new Date(),
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "ELIGIBILITY_OVERRIDE",
      entityType: "EligibilityOverride",
      entityId: override.id,
      newState: { studentId, studentName: student.user.name, jobId, jobTitle: job.title, reason },
    });

    await createNotification({
      userId: student.userId,
      title: "Placement Officer Eligibility Exemption",
      message: `An eligibility override was approved for ${job.title} at ${job.company.name}. You can now submit your application.`,
      type: "SUCCESS",
      link: `/jobs/${job.id}`,
    });

    return NextResponse.json({ success: true, override });
  } catch (err: any) {
    console.error("Eligibility override API error:", err);
    return NextResponse.json({ error: "Failed to create eligibility override" }, { status: 500 });
  }
}
