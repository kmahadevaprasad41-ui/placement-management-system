import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { detectStudentSchedulingConflict } from "@/lib/conflict-detector";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (status) where.status = status;

    if (user.role === "STUDENT" && user.studentId) {
      where.studentId = user.studentId;
    } else if (user.role === "RECRUITER" && user.companyId) {
      where.job = { companyId: user.companyId };
    }

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true, avatarUrl: true } },
            department: true,
            academicRecord: true,
          },
        },
        job: {
          include: { company: true },
        },
        feedbacks: true,
      },
      orderBy: { scheduledStart: "asc" },
    });

    return NextResponse.json({ interviews });
  } catch (err: any) {
    console.error("Interviews list error:", err);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Interview scheduling rights required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      jobId,
      studentId,
      roundNumber,
      roundName,
      interviewerName,
      scheduledStart,
      scheduledEnd,
      venue,
      meetLink,
      ignoreConflict,
    } = body;

    if (!jobId || !studentId || !scheduledStart || !scheduledEnd) {
      return NextResponse.json({ error: "Job, Student, and time slot are required." }, { status: 400 });
    }

    const start = new Date(scheduledStart);
    const end = new Date(scheduledEnd);

    // 1. Conflict Check Engine
    if (!ignoreConflict) {
      const conflict = await detectStudentSchedulingConflict(studentId, start, end);
      if (conflict.hasConflict) {
        return NextResponse.json({
          hasConflict: true,
          conflictDetails: conflict.conflictDetails,
          error: `Scheduling conflict detected: Candidate already has '${conflict.conflictDetails?.title}' scheduled from ${conflict.conflictDetails?.scheduledStart} to ${conflict.conflictDetails?.scheduledEnd}.`,
        }, { status: 409 });
      }
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!job || !student) {
      return NextResponse.json({ error: "Job or Student record not found" }, { status: 404 });
    }

    const interview = await prisma.interview.create({
      data: {
        jobId,
        studentId,
        roundNumber: roundNumber ? parseInt(roundNumber) : 1,
        roundName: roundName || `Round ${roundNumber || 1} Interview`,
        interviewerName: interviewerName || "Senior Technical Interviewer",
        scheduledStart: start,
        scheduledEnd: end,
        venue: venue || "Virtual Google Meet",
        meetLink: meetLink || "https://meet.google.com/pms-interview-room",
        status: "SCHEDULED",
      },
    });

    // Update application stage to INTERVIEW
    await prisma.application.updateMany({
      where: { studentId, jobId },
      data: { currentStage: "INTERVIEW" },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "INTERVIEW_SCHEDULED",
      entityType: "Interview",
      entityId: interview.id,
      newState: { studentName: student.user.name, company: job.company.name, roundName },
    });

    await createNotification({
      userId: student.userId,
      title: `Interview Scheduled: ${job.company.name}`,
      message: `Your ${roundName || "Technical Interview"} for ${job.title} is scheduled on ${start.toLocaleDateString()} at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      type: "INTERVIEW",
      link: "/interviews",
    });

    return NextResponse.json({ success: true, interview });
  } catch (err: any) {
    console.error("Interview create error:", err);
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
