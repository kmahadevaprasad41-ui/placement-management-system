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
    const q = searchParams.get("q") || "";

    if (!q.trim() || q.length < 2) {
      return NextResponse.json({ students: [], companies: [], jobs: [], drives: [] });
    }

    const query = q.trim();

    // Query Students
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { rollNumber: { contains: query } },
          { user: { name: { contains: query } } },
          { user: { email: { contains: query } } },
        ],
        ...(user.role === "DEPARTMENT_COORDINATOR" && user.departmentCode
          ? { department: { code: user.departmentCode } }
          : {}),
      },
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        department: true,
        academicRecord: true,
      },
      take: 5,
    });

    // Query Companies
    const companies = await prisma.company.findMany({
      where: {
        name: { contains: query },
        ...(user.role === "STUDENT" ? { status: "APPROVED" } : {}),
      },
      take: 5,
    });

    // Query Jobs
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { role: { contains: query } },
          { company: { name: { contains: query } } },
        ],
        ...(user.role === "STUDENT" ? { status: "PUBLISHED" } : {}),
      },
      include: { company: true },
      take: 5,
    });

    // Query Drives
    const drives = await prisma.placementDrive.findMany({
      where: {
        title: { contains: query },
      },
      include: { company: true },
      take: 5,
    });

    return NextResponse.json({
      students: user.role === "STUDENT" ? [] : students,
      companies,
      jobs,
      drives,
    });
  } catch (err: any) {
    console.error("Global search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
