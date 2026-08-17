import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const companyId = id === "my-company" ? user.companyId : id;
    if (!companyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        recruiters: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        jobs: {
          include: {
            eligibilityRule: true,
            applications: {
              include: {
                student: { include: { user: true, department: true, academicRecord: true } },
              },
            },
            drives: true,
            offers: true,
          },
          orderBy: { createdAt: "desc" },
        },
        drives: {
          orderBy: { driveDate: "asc" },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (err: any) {
    console.error("Company detail API error:", err);
    return NextResponse.json({ error: "Failed to fetch company details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status, tier, industry, website, hqAddress, description, logoUrl, approvalNotes } = body;

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const updated = await prisma.company.update({
      where: { id },
      data: {
        ...(status !== undefined && user.role !== "RECRUITER" ? { status } : {}),
        ...(tier !== undefined && user.role !== "RECRUITER" ? { tier } : {}),
        ...(approvalNotes !== undefined && user.role !== "RECRUITER" ? { approvalNotes } : {}),
        ...(industry !== undefined ? { industry } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(hqAddress !== undefined ? { hqAddress } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "COMPANY_UPDATED",
      entityType: "Company",
      entityId: id,
      previousState: existing,
      newState: updated,
    });

    return NextResponse.json({ success: true, company: updated });
  } catch (err: any) {
    console.error("Company update API error:", err);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}
