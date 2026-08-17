import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage") || "";
    const jobId = searchParams.get("jobId") || "";
    const departmentCode = searchParams.get("department") || "";

    const where: any = {};

    if (user.role === "STUDENT" && user.studentId) {
      where.studentId = user.studentId;
    } else if (user.role === "RECRUITER" && user.companyId) {
      where.job = { companyId: user.companyId };
    } else if (user.role === "DEPARTMENT_COORDINATOR" && user.departmentCode) {
      where.student = { department: { code: user.departmentCode } };
    }

    if (stage) where.currentStage = stage;
    if (jobId) where.jobId = jobId;
    if (departmentCode && user.role !== "DEPARTMENT_COORDINATOR") {
      where.student = { department: { code: departmentCode } };
    }

    const applications = await prisma.application.findMany({
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
          include: {
            company: true,
          },
        },
        resume: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error("Applications list API error:", err);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
