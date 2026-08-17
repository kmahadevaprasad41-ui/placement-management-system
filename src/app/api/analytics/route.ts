import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalStudents = await prisma.student.count();
    const placedStudents = await prisma.student.count({ where: { placementStatus: "PLACED" } });
    const inProcessStudents = await prisma.student.count({ where: { placementStatus: "IN_PROCESS" } });
    const unplacedStudents = totalStudents - placedStudents;
    const placementRate = totalStudents > 0 ? +((placedStudents / totalStudents) * 100).toFixed(1) : 0;

    const totalOffers = await prisma.offer.count();
    const acceptedOffers = await prisma.offer.count({ where: { status: "ACCEPTED" } });
    const acceptanceRate = totalOffers > 0 ? +((acceptedOffers / totalOffers) * 100).toFixed(1) : 0;

    // CTC stats
    const offers = await prisma.offer.findMany({
      select: { ctcLPA: true, company: { select: { name: true, tier: true } } },
      orderBy: { ctcLPA: "asc" },
    });

    const ctcValues = offers.map((o) => o.ctcLPA);
    const highestCTC = ctcValues.length > 0 ? Math.max(...ctcValues) : 0;
    const averageCTC = ctcValues.length > 0 ? +(ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(1) : 0;
    const medianCTC =
      ctcValues.length > 0
        ? ctcValues.length % 2 === 0
          ? +((ctcValues[ctcValues.length / 2 - 1] + ctcValues[ctcValues.length / 2]) / 2).toFixed(1)
          : ctcValues[Math.floor(ctcValues.length / 2)]
        : 0;

    // CTC Bands Distribution
    const ctcDistribution = [
      { range: "< ₹8 LPA", count: ctcValues.filter((v) => v < 8).length },
      { range: "₹8 - ₹15 LPA", count: ctcValues.filter((v) => v >= 8 && v < 15).length },
      { range: "₹15 - ₹25 LPA", count: ctcValues.filter((v) => v >= 15 && v < 25).length },
      { range: "₹25+ LPA (Super Dream)", count: ctcValues.filter((v) => v >= 25).length },
    ];

    // Department Stats
    const departments = await prisma.department.findMany({
      include: {
        students: {
          include: { offers: true },
        },
      },
    });

    const departmentStats = departments.map((d) => {
      const deptTotal = d.students.length;
      const deptPlaced = d.students.filter((s) => s.placementStatus === "PLACED").length;
      const deptPct = deptTotal > 0 ? Math.round((deptPlaced / deptTotal) * 100) : 0;
      const deptOffers = d.students.flatMap((s) => s.offers);
      const deptAvg = deptOffers.length > 0 ? +(deptOffers.reduce((sum, o) => sum + o.ctcLPA, 0) / deptOffers.length).toFixed(1) : 0;

      return {
        code: d.code,
        name: d.name,
        totalStudents: deptTotal,
        placedStudents: deptPlaced,
        placementPercentage: deptPct,
        averageCTC: deptAvg,
      };
    });

    // Funnel Stats
    const totalApps = await prisma.application.count();
    const stageCounts = await prisma.application.groupBy({
      by: ["currentStage"],
      _count: { id: true },
    });

    const stageMap = new Map(stageCounts.map((s) => [s.currentStage, s._count.id]));
    const funnelStats = ["APPLIED", "SHORTLISTED", "TEST", "INTERVIEW", "SELECTED", "OFFERED", "JOINED"].map((stage) => {
      const count = stageMap.get(stage) || 0;
      return {
        stage,
        count,
        percentage: totalApps > 0 ? Math.round((count / totalApps) * 100) : 0,
      };
    });

    return NextResponse.json({
      metrics: {
        totalStudents,
        placedStudents,
        inProcessStudents,
        unplacedStudents,
        placementRate,
        totalOffers,
        acceptedOffers,
        acceptanceRate,
        highestCTC,
        averageCTC,
        medianCTC,
      },
      ctcDistribution,
      departmentStats,
      funnelStats,
    });
  } catch (err: any) {
    console.error("Analytics API error:", err);
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 });
  }
}
