import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateStudentEligibility } from "@/lib/eligibility-engine";
import { checkStudentApplicationPolicy } from "@/lib/policy-engine";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentId) {
      return NextResponse.json({ error: "Only authenticated students can apply for jobs." }, { status: 403 });
    }

    const { id: jobId } = await context.params;
    const studentId = user.studentId;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true, eligibilityRule: true },
    });

    if (!job || job.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Job is not accepting applications." }, { status: 400 });
    }

    if (new Date(job.deadline) < new Date()) {
      return NextResponse.json({ error: "Application deadline for this job has expired." }, { status: 400 });
    }

    // 1. Check duplicate application
    const existingApp = await prisma.application.findUnique({
      where: {
        studentId_jobId: { studentId, jobId },
      },
    });

    if (existingApp) {
      return NextResponse.json({ error: "You have already submitted an application for this job." }, { status: 400 });
    }

    // 2. Check student eligibility
    const eligibility = await evaluateStudentEligibility(studentId, jobId);
    if (!eligibility.isEligible) {
      return NextResponse.json({
        error: "You do not meet the minimum eligibility requirements for this job.",
        details: eligibility.criteria.filter((c) => !c.passed),
      }, { status: 400 });
    }

    // 3. Check multiple-offer institutional placement policy
    const policyCheck = await checkStudentApplicationPolicy(studentId, job.ctcLPA);
    if (!policyCheck.allowed) {
      return NextResponse.json({
        error: policyCheck.reason || "Application blocked by institutional placement policy.",
      }, { status: 400 });
    }

    // 4. Retrieve default resume
    const defaultResume = await prisma.resume.findFirst({
      where: { studentId, isDefault: true },
    });

    // 5. Transactional application creation
    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          studentId,
          jobId,
          resumeId: defaultResume?.id ?? null,
          currentStage: "APPLIED",
          status: "ACTIVE",
          notes: eligibility.overridden ? `Eligible via Placement Officer Override: ${eligibility.overrideReason}` : "Standard eligibility met.",
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStage: "NONE",
          toStage: "APPLIED",
          changeReason: "Candidate applied via student portal",
        },
      });

      // Update student status to IN_PROCESS if currently unplaced
      const currentStudent = await tx.student.findUnique({ where: { id: studentId } });
      if (currentStudent && currentStudent.placementStatus === "UNPLACED") {
        await tx.student.update({
          where: { id: studentId },
          data: { placementStatus: "IN_PROCESS" },
        });
      }

      return application;
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: "STUDENT",
      action: "APPLICATION_SUBMITTED",
      entityType: "Application",
      entityId: result.id,
      newState: { jobId, jobTitle: job.title, company: job.company.name },
    });

    await createNotification({
      userId: user.id,
      title: `Applied to ${job.company.name}`,
      message: `Your application for ${job.title} (${job.ctcLPA} LPA) has been submitted successfully.`,
      type: "SUCCESS",
      link: "/applications",
    });

    return NextResponse.json({ success: true, application: result });
  } catch (err: any) {
    console.error("Apply job error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
