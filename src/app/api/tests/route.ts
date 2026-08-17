import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tests = await prisma.test.findMany({
      include: {
        job: { include: { company: true } },
        drive: true,
        results: {
          include: {
            student: {
              include: {
                user: { select: { name: true, email: true } },
                department: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json({ tests });
  } catch (err: any) {
    console.error("Tests list error:", err);
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, driveId, title, testType, platform, scheduledAt, durationMinutes, maxMarks, instructions } = body;

    const test = await prisma.test.create({
      data: {
        jobId,
        driveId,
        title,
        testType: testType || "ONLINE_CODING",
        platform: platform || "HackerRank",
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 90,
        maxMarks: maxMarks ? parseInt(maxMarks) : 100,
        instructions,
      },
    });

    return NextResponse.json({ success: true, test });
  } catch (err: any) {
    console.error("Create test error:", err);
    return NextResponse.json({ error: "Failed to create test" }, { status: 500 });
  }
}
