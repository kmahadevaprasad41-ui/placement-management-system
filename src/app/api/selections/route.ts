import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (user.role === "STUDENT" && user.studentId) {
      where.studentId = user.studentId;
    } else if (user.role === "RECRUITER" && user.companyId) {
      where.job = { companyId: user.companyId };
    }

    const selections = await prisma.selection.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true, avatarUrl: true } },
            department: true,
            academicRecord: true,
          },
        },
        job: { include: { company: true } },
        offers: true,
      },
      orderBy: { selectedAt: "desc" },
    });

    return NextResponse.json({ selections });
  } catch (err: any) {
    console.error("Selections list error:", err);
    return NextResponse.json({ error: "Failed to fetch selections" }, { status: 500 });
  }
}
