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
    const search = searchParams.get("search") || "";
    const departmentCode = searchParams.get("department") || "";
    const placementStatus = searchParams.get("status") || "";
    const minCGPA = searchParams.get("minCGPA") ? parseFloat(searchParams.get("minCGPA")!) : undefined;
    const isVerified = searchParams.get("verified") ? searchParams.get("verified") === "true" : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // If Department Coordinator, scope queries to their assigned department
    let finalDeptCode = departmentCode;
    if (user.role === "DEPARTMENT_COORDINATOR" && user.departmentCode) {
      finalDeptCode = user.departmentCode;
    }

    const where: any = {};

    if (search) {
      where.OR = [
        { rollNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    if (finalDeptCode) {
      where.department = { code: finalDeptCode };
    }

    if (placementStatus) {
      where.placementStatus = placementStatus;
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    if (minCGPA !== undefined) {
      where.academicRecord = { cgpa: { gte: minCGPA } };
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          department: true,
          program: true,
          batch: true,
          academicRecord: true,
          skills: { include: { skill: true } },
          offers: { select: { id: true, ctcLPA: true, status: true, company: { select: { name: true } } } },
        },
        orderBy: { rollNumber: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("Students list API error:", err);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
