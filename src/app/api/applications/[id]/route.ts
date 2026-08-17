import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Stage update privileges required." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { stage, reason, notes } = body;

    if (!stage) {
      return NextResponse.json({ error: "New stage is required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        job: { include: { company: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const fromStage = application.currentStage;
    const toStage = stage;

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id },
        data: {
          currentStage: toStage,
          ...(notes ? { notes } : {}),
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id,
          fromStage,
          toStage,
          changedById: user.id,
          changeReason: reason || `Progressed from ${fromStage} to ${toStage} by ${user.name}`,
        },
      });

      // If Selected stage, automatically create a Selection record if not exists
      if (toStage === "SELECTED") {
        await tx.selection.upsert({
          where: {
            jobId_studentId: {
              jobId: application.jobId,
              studentId: application.studentId,
            },
          },
          create: {
            jobId: application.jobId,
            studentId: application.studentId,
            applicationId: application.id,
            status: "SELECTED",
            remarks: `Selected by ${user.name}`,
          },
          update: {
            status: "SELECTED",
          },
        });
      }

      return app;
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "APPLICATION_STAGE_CHANGED",
      entityType: "Application",
      entityId: id,
      previousState: { stage: fromStage },
      newState: { stage: toStage, reason },
    });

    await createNotification({
      userId: application.student.userId,
      title: `Application Update: ${application.job.company.name}`,
      message: `Your application for ${application.job.title} has moved to ${toStage}.`,
      type: toStage === "SELECTED" || toStage === "OFFERED" ? "OFFER" : "INFO",
      link: "/applications",
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error("Application update error:", err);
    return NextResponse.json({ error: "Failed to update application stage" }, { status: 500 });
  }
}
