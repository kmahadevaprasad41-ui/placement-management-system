import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "MANAGEMENT", "DEPARTMENT_COORDINATOR"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Report generation privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("type") || "placed_students"; // placed_students, all_candidates, company_offers, drive_attendance
    const departmentCode = searchParams.get("department") || "";

    let finalDept = departmentCode;
    if (user.role === "DEPARTMENT_COORDINATOR" && user.departmentCode) {
      finalDept = user.departmentCode;
    }

    if (reportType === "placed_students") {
      const students = await prisma.student.findMany({
        where: {
          placementStatus: "PLACED",
          ...(finalDept ? { department: { code: finalDept } } : {}),
        },
        include: {
          user: { select: { name: true, email: true } },
          department: true,
          academicRecord: true,
          offers: {
            include: { company: true, job: true },
            where: { status: "ACCEPTED" },
          },
        },
        orderBy: { rollNumber: "asc" },
      });

      const rows = students.map((s) => ({
        rollNumber: s.rollNumber,
        name: s.user.name,
        email: s.user.email,
        department: s.department.code,
        cgpa: s.academicRecord?.cgpa ?? "N/A",
        placedCompany: s.offers[0]?.company.name ?? "N/A",
        jobTitle: s.offers[0]?.job.title ?? "N/A",
        ctcLPA: s.offers[0]?.ctcLPA ?? "N/A",
        offerDate: s.offers[0]?.offerDate ? new Date(s.offers[0].offerDate).toLocaleDateString() : "N/A",
      }));

      return NextResponse.json({ reportType, total: rows.length, rows });
    }

    if (reportType === "company_offers") {
      const offers = await prisma.offer.findMany({
        include: {
          company: true,
          job: true,
          student: {
            include: { user: true, department: true, academicRecord: true },
          },
        },
        orderBy: { ctcLPA: "desc" },
      });

      const rows = offers.map((o) => ({
        offerNumber: o.offerLetterNumber,
        company: o.company.name,
        tier: o.company.tier,
        candidate: o.student.user.name,
        rollNumber: o.student.rollNumber,
        department: o.student.department.code,
        role: o.job.title,
        ctcLPA: o.ctcLPA,
        status: o.status,
        joiningDate: o.joiningDate ? new Date(o.joiningDate).toLocaleDateString() : "N/A",
      }));

      return NextResponse.json({ reportType, total: rows.length, rows });
    }

    // Default: all candidates summary
    const allStudents = await prisma.student.findMany({
      where: {
        ...(finalDept ? { department: { code: finalDept } } : {}),
      },
      include: {
        user: { select: { name: true, email: true } },
        department: true,
        academicRecord: true,
        offers: true,
        applications: true,
      },
      orderBy: { rollNumber: "asc" },
    });

    const rows = allStudents.map((s) => ({
      rollNumber: s.rollNumber,
      name: s.user.name,
      email: s.user.email,
      department: s.department.code,
      cgpa: s.academicRecord?.cgpa ?? 0,
      activeBacklogs: s.academicRecord?.activeBacklogs ?? 0,
      placementStatus: s.placementStatus,
      isVerified: s.isVerified ? "YES" : "NO",
      applicationsCount: s.applications.length,
      offersCount: s.offers.length,
    }));

    return NextResponse.json({ reportType: "all_candidates", total: rows.length, rows });
  } catch (err: any) {
    console.error("Report generation error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
