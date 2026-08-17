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
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { industry: { contains: search } },
      ];
    }
    if (tier) where.tier = tier;
    if (status) where.status = status;

    const companies = await prisma.company.findMany({
      where,
      include: {
        recruiters: {
          include: {
            user: { select: { name: true, email: true, avatarUrl: true } },
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            ctcLPA: true,
            status: true,
            applications: { select: { id: true } },
          },
        },
        offers: { select: { id: true, status: true, ctcLPA: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ companies });
  } catch (err: any) {
    console.error("Company list API error:", err);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, industry, companyType, tier, website, hqAddress, description, logoUrl, status } = body;

    if (!name || !industry) {
      return NextResponse.json({ error: "Company name and industry are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const company = await prisma.company.create({
      data: {
        name,
        slug,
        industry,
        companyType: companyType || "PRODUCT",
        tier: tier || "TIER_2",
        website,
        hqAddress,
        description,
        logoUrl: logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${slug}`,
        status: status || "APPROVED",
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "COMPANY_CREATED",
      entityType: "Company",
      entityId: company.id,
      newState: company,
    });

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    console.error("Create company error:", err);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
