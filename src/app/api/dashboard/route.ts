import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStudentProfileCompletion } from "@/lib/profile-engine";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "STUDENT" && user.studentId) {
      const student = await prisma.student.findUnique({
        where: { id: user.studentId },
        include: {
          department: true,
          academicRecord: true,
          applications: {
            include: {
              job: { include: { company: true } },
            },
            orderBy: { appliedAt: "desc" },
          },
          interviews: {
            where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
            include: { job: { include: { company: true } } },
            orderBy: { scheduledStart: "asc" },
          },
          offers: {
            include: { company: true, job: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!student) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }

      const profileBreakdown = await calculateStudentProfileCompletion(student.id);
      const allPublishedJobs = await prisma.job.findMany({
        where: { status: "PUBLISHED", deadline: { gte: new Date() } },
        include: { company: true, eligibilityRule: true },
      });

      const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      return NextResponse.json({
        role: "STUDENT",
        student,
        profileBreakdown,
        stats: {
          totalApplications: student.applications.length,
          activeInterviews: student.interviews.length,
          totalOffers: student.offers.length,
          availableJobs: allPublishedJobs.length,
          placementStatus: student.placementStatus,
        },
        recentApplications: student.applications.slice(0, 5),
        upcomingInterviews: student.interviews.slice(0, 3),
        offers: student.offers,
        announcements,
      });
    }

    if (user.role === "RECRUITER" && user.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: user.companyId },
        include: {
          jobs: {
            include: {
              applications: {
                include: {
                  student: {
                    include: {
                      user: true,
                      department: true,
                      academicRecord: true,
                    },
                  },
                },
              },
              interviews: true,
              offers: true,
            },
          },
          drives: true,
        },
      });

      if (!company) {
        return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
      }

      let totalApplicants = 0;
      let shortlistedCount = 0;
      let interviewedCount = 0;
      let offeredCount = 0;
      let acceptedOffersCount = 0;

      company.jobs.forEach((j) => {
        totalApplicants += j.applications.length;
        shortlistedCount += j.applications.filter((a) => a.currentStage === "SHORTLISTED").length;
        interviewedCount += j.applications.filter((a) => a.currentStage === "INTERVIEW").length;
        offeredCount += j.offers.length;
        acceptedOffersCount += j.offers.filter((o) => o.status === "ACCEPTED").length;
      });

      return NextResponse.json({
        role: "RECRUITER",
        company,
        stats: {
          activeJobs: company.jobs.filter((j) => j.status === "PUBLISHED").length,
          totalApplicants,
          shortlistedCount,
          interviewedCount,
          offeredCount,
          acceptedOffersCount,
        },
        jobs: company.jobs,
        upcomingDrives: company.drives,
      });
    }

    // Default Institutional Dashboard for PLACEMENT_OFFICER, SUPER_ADMIN, MANAGEMENT, COORDINATOR
    const totalStudents = await prisma.student.count();
    const verifiedStudents = await prisma.student.count({ where: { isVerified: true } });
    const placedStudents = await prisma.student.count({ where: { placementStatus: "PLACED" } });
    const inProcessStudents = await prisma.student.count({ where: { placementStatus: "IN_PROCESS" } });
    const unplacedStudents = totalStudents - placedStudents;
    const placementPercentage = totalStudents > 0 ? +((placedStudents / totalStudents) * 100).toFixed(1) : 0;

    const totalCompanies = await prisma.company.count({ where: { status: "APPROVED" } });
    const totalJobs = await prisma.job.count({ where: { status: "PUBLISHED" } });
    const totalApplications = await prisma.application.count();
    const totalOffers = await prisma.offer.count();
    const acceptedOffers = await prisma.offer.count({ where: { status: "ACCEPTED" } });

    // CTC stats
    const allOffers = await prisma.offer.findMany({
      select: { ctcLPA: true },
      orderBy: { ctcLPA: "asc" },
    });

    const ctcList = allOffers.map((o) => o.ctcLPA);
    const highestCTC = ctcList.length > 0 ? Math.max(...ctcList) : 0;
    const averageCTC = ctcList.length > 0 ? +(ctcList.reduce((a, b) => a + b, 0) / ctcList.length).toFixed(1) : 0;
    const medianCTC =
      ctcList.length > 0
        ? ctcList.length % 2 === 0
          ? +((ctcList[ctcList.length / 2 - 1] + ctcList[ctcList.length / 2]) / 2).toFixed(1)
          : ctcList[Math.floor(ctcList.length / 2)]
        : 0;

    // Department-wise Stats
    const departments = await prisma.department.findMany({
      include: {
        students: {
          include: {
            offers: true,
          },
        },
      },
    });

    const departmentStats = departments.map((d) => {
      const deptTotal = d.students.length;
      const deptPlaced = d.students.filter((s) => s.placementStatus === "PLACED").length;
      const deptPct = deptTotal > 0 ? Math.round((deptPlaced / deptTotal) * 100) : 0;
      const deptOffers = d.students.flatMap((s) => s.offers);
      const deptAvgCtc =
        deptOffers.length > 0
          ? +(deptOffers.reduce((sum, o) => sum + o.ctcLPA, 0) / deptOffers.length).toFixed(1)
          : 0;

      return {
        code: d.code,
        name: d.name,
        totalStudents: deptTotal,
        placedStudents: deptPlaced,
        placementPercentage: deptPct,
        averageCTC: deptAvgCtc,
      };
    });

    // Recruitment Funnel Stats
    const stageCounts = await prisma.application.groupBy({
      by: ["currentStage"],
      _count: { id: true },
    });

    const stageMap = new Map(stageCounts.map((s) => [s.currentStage, s._count.id]));
    const funnelStages = ["APPLIED", "SHORTLISTED", "TEST", "INTERVIEW", "SELECTED", "OFFERED", "JOINED"];
    const funnelStats = funnelStages.map((stage) => {
      const count = stageMap.get(stage) || 0;
      return {
        stage,
        count,
        percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
      };
    });

    // Recent items
    const recentApplications = await prisma.application.findMany({
      take: 6,
      orderBy: { appliedAt: "desc" },
      include: {
        student: { include: { user: true, department: true } },
        job: { include: { company: true } },
      },
    });

    const upcomingDrives = await prisma.placementDrive.findMany({
      take: 4,
      orderBy: { driveDate: "asc" },
      include: { company: true, job: true },
    });

    const recentOffers = await prisma.offer.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: { include: { user: true, department: true } }, company: true, job: true },
    });

    return NextResponse.json({
      role: user.role,
      stats: {
        totalStudents,
        verifiedStudents,
        placedStudents,
        inProcessStudents,
        unplacedStudents,
        placementPercentage,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalOffers,
        acceptedOffers,
        highestCTC,
        averageCTC,
        medianCTC,
      },
      departmentStats,
      funnelStats,
      recentApplications,
      upcomingDrives,
      recentOffers,
    });
  } catch (err: any) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to generate dashboard data" }, { status: 500 });
  }
}
