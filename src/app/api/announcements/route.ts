import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ announcements });
  } catch (err: any) {
    console.error("Announcements list error:", err);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Only placement authorities can publish announcements." }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, priority, targetDepartments, targetBatches } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        priority: priority || "NORMAL",
        targetDepartments: targetDepartments ? JSON.stringify(targetDepartments) : null,
        targetBatches: targetBatches ? JSON.stringify(targetBatches) : null,
        createdById: user.id,
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "ANNOUNCEMENT_PUBLISHED",
      entityType: "Announcement",
      entityId: announcement.id,
      newState: { title, priority },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (err: any) {
    console.error("Publish announcement error:", err);
    return NextResponse.json({ error: "Failed to publish announcement" }, { status: 500 });
  }
}
