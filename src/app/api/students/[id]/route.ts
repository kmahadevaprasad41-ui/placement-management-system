import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStudentProfileCompletion } from "@/lib/profile-engine";
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

    // Resolve 'me' keyword for current student
    const studentId = id === "me" ? user.studentId : id;
    if (!studentId) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    // Role-based privacy guard: students can only see their own private profile, coordinators only their dept
    if (user.role === "STUDENT" && user.studentId !== studentId) {
      return NextResponse.json({ error: "Access forbidden." }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        department: true,
        program: true,
        batch: true,
        academicRecord: true,
        skills: { include: { skill: true } },
        projects: { orderBy: { createdAt: "desc" } },
        internships: { orderBy: { createdAt: "desc" } },
        certifications: { orderBy: { createdAt: "desc" } },
        resumes: { orderBy: { createdAt: "desc" } },
        applications: {
          include: {
            job: { include: { company: true } },
            statusHistory: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { appliedAt: "desc" },
        },
        interviews: {
          include: {
            job: { include: { company: true } },
            feedbacks: true,
          },
          orderBy: { scheduledStart: "desc" },
        },
        offers: {
          include: {
            company: true,
            job: true,
            joiningRecord: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const profileBreakdown = await calculateStudentProfileCompletion(student.id);

    return NextResponse.json({ student, profileBreakdown });
  } catch (err: any) {
    console.error("Student detail API error:", err);
    return NextResponse.json({ error: "Failed to fetch student details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const studentId = id === "me" ? user.studentId : id;
    if (!studentId) {
      return NextResponse.json({ error: "Invalid student identifier" }, { status: 400 });
    }

    if (user.role === "STUDENT" && user.studentId !== studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      phone,
      dob,
      gender,
      address,
      resumeSummary,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      placementStatus,
    } = body;

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...(phone !== undefined ? { phone } : {}),
        ...(dob !== undefined ? { dob } : {}),
        ...(gender !== undefined ? { gender } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(resumeSummary !== undefined ? { resumeSummary } : {}),
        ...(linkedinUrl !== undefined ? { linkedinUrl } : {}),
        ...(githubUrl !== undefined ? { githubUrl } : {}),
        ...(portfolioUrl !== undefined ? { portfolioUrl } : {}),
        ...(placementStatus && user.role !== "STUDENT" ? { placementStatus } : {}),
      },
    });

    await calculateStudentProfileCompletion(studentId);

    return NextResponse.json({ success: true, student: updated });
  } catch (err: any) {
    console.error("Student update API error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
