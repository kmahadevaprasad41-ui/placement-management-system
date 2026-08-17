import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Interview feedback rights required." }, { status: 403 });
    }

    const { id: interviewId } = await context.params;
    const body = await req.json();
    const {
      technicalRating,
      communicationRating,
      problemSolvingRating,
      overallScore,
      recommendation,
      strengths,
      weaknesses,
      remarks,
    } = body;

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { student: { include: { user: true } }, job: { include: { company: true } } },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview record not found" }, { status: 404 });
    }

    const feedback = await prisma.interviewFeedback.create({
      data: {
        interviewId,
        interviewerId: user.id,
        technicalRating: technicalRating ? parseInt(technicalRating) : 4,
        communicationRating: communicationRating ? parseInt(communicationRating) : 4,
        problemSolvingRating: problemSolvingRating ? parseInt(problemSolvingRating) : 4,
        overallScore: overallScore ? parseFloat(overallScore) : 8.0,
        recommendation: recommendation || "ADVANCE",
        strengths,
        weaknesses,
        remarks,
      },
    });

    // Mark interview as COMPLETED
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: "COMPLETED" },
    });

    // If recommendation is SELECT, advance stage
    if (recommendation === "SELECT") {
      await prisma.application.updateMany({
        where: { studentId: interview.studentId, jobId: interview.jobId },
        data: { currentStage: "SELECTED" },
      });

      await prisma.selection.upsert({
        where: {
          jobId_studentId: { jobId: interview.jobId, studentId: interview.studentId },
        },
        create: {
          jobId: interview.jobId,
          studentId: interview.studentId,
          status: "SELECTED",
          remarks: `Selected post ${interview.roundName} with score ${overallScore || 8.0}/10`,
        },
        update: {
          status: "SELECTED",
          remarks: `Selected post ${interview.roundName}`,
        },
      });
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "INTERVIEW_FEEDBACK_SUBMITTED",
      entityType: "InterviewFeedback",
      entityId: feedback.id,
      newState: { candidate: interview.student.user.name, recommendation, overallScore },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (err: any) {
    console.error("Feedback submit error:", err);
    return NextResponse.json({ error: "Failed to submit interview feedback" }, { status: 500 });
  }
}
