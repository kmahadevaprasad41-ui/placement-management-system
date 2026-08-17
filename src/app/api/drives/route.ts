import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

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

    if (user.role === "RECRUITER" && user.companyId) {
      where.companyId = user.companyId;
    }

    const drives = await prisma.placementDrive.findMany({
      where,
      include: {
        company: true,
        job: true,
        tests: true,
        interviews: true,
        participants: {
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
      orderBy: { driveDate: "asc" },
    });

    return NextResponse.json({ drives });
  } catch (err: any) {
    console.error("Drives list error:", err);
    return NextResponse.json({ error: "Failed to fetch placement drives" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, title, driveDate, venue, isOnline, meetLink, stages, instructions } = body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Valid job reference required" }, { status: 400 });
    }

    const drive = await prisma.placementDrive.create({
      data: {
        jobId,
        companyId: job.companyId,
        title: title || `${job.title} Recruitment Drive`,
        driveDate: new Date(driveDate),
        venue: venue || "Main Placement Auditorium",
        isOnline: Boolean(isOnline),
        meetLink,
        stages: stages || "Online Assessment, Technical Interview, HR Round",
        status: "UPCOMING",
        instructions,
        createdById: user.id,
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "DRIVE_CREATED",
      entityType: "PlacementDrive",
      entityId: drive.id,
      newState: drive,
    });

    return NextResponse.json({ success: true, drive });
  } catch (err: any) {
    console.error("Create drive error:", err);
    return NextResponse.json({ error: "Failed to create drive" }, { status: 500 });
  }
}
