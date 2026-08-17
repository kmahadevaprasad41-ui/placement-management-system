import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateStudentEligibility } from "@/lib/eligibility-engine";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        eligibilityRule: true,
        applications: {
          include: {
            student: {
              include: {
                user: { select: { name: true, email: true, avatarUrl: true } },
                department: true,
                academicRecord: true,
              },
            },
            statusHistory: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { appliedAt: "desc" },
        },
        drives: true,
        tests: true,
        interviews: true,
        offers: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // If student, compute their eligibility and application status
    let studentEligibility = null;
    let hasApplied = false;
    let applicationDetails = null;

    if (user.role === "STUDENT" && user.studentId) {
      studentEligibility = await evaluateStudentEligibility(user.studentId, job.id);
      const app = job.applications.find((a) => a.studentId === user.studentId);
      if (app) {
        hasApplied = true;
        applicationDetails = app;
      }
    }

    return NextResponse.json({
      job,
      studentEligibility,
      hasApplied,
      applicationDetails,
    });
  } catch (err: any) {
    console.error("Job detail API error:", err);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status, title, role, description, requirements, workMode, location, ctcLPA, deadline } = body;

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(requirements !== undefined ? { requirements } : {}),
        ...(workMode !== undefined ? { workMode } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(ctcLPA !== undefined ? { ctcLPA: parseFloat(ctcLPA) } : {}),
        ...(deadline !== undefined ? { deadline: new Date(deadline) } : {}),
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "JOB_UPDATED",
      entityType: "Job",
      entityId: id,
      previousState: existing,
      newState: updated,
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (err: any) {
    console.error("Job update API error:", err);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
