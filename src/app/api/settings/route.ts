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

    const settings = await prisma.institutionSetting.findFirst();
    const policy = await prisma.multipleOfferPolicy.findFirst({ where: { isActive: true } });
    const departments = await prisma.department.findMany({ include: { programs: true } });
    const batches = await prisma.batch.findMany();

    return NextResponse.json({ settings, policy, departments, batches });
  } catch (err: any) {
    console.error("Settings fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Super Administrator privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      institutionName,
      currentAcademicYear,
      resumeMaxSizeMB,
      allowMultipleOffers,
      stopAfterAcceptedOffer,
      minCtcMultiplierForSecondOffer,
      minAbsoluteCtcForSecondOffer,
      maxOffersAllowed,
    } = body;

    const setting = await prisma.institutionSetting.findFirst();
    if (setting) {
      await prisma.institutionSetting.update({
        where: { id: setting.id },
        data: {
          institutionName: institutionName || setting.institutionName,
          currentAcademicYear: currentAcademicYear || setting.currentAcademicYear,
          resumeMaxSizeMB: resumeMaxSizeMB ? parseInt(resumeMaxSizeMB) : setting.resumeMaxSizeMB,
        },
      });
    }

    const policy = await prisma.multipleOfferPolicy.findFirst({ where: { isActive: true } });
    if (policy) {
      await prisma.multipleOfferPolicy.update({
        where: { id: policy.id },
        data: {
          allowMultipleOffers: allowMultipleOffers !== undefined ? Boolean(allowMultipleOffers) : policy.allowMultipleOffers,
          stopAfterAcceptedOffer: stopAfterAcceptedOffer !== undefined ? Boolean(stopAfterAcceptedOffer) : policy.stopAfterAcceptedOffer,
          minCtcMultiplierForSecondOffer: minCtcMultiplierForSecondOffer ? parseFloat(minCtcMultiplierForSecondOffer) : policy.minCtcMultiplierForSecondOffer,
          minAbsoluteCtcForSecondOffer: minAbsoluteCtcForSecondOffer ? parseFloat(minAbsoluteCtcForSecondOffer) : policy.minAbsoluteCtcForSecondOffer,
          maxOffersAllowed: maxOffersAllowed ? parseInt(maxOffersAllowed) : policy.maxOffersAllowed,
        },
      });
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "SETTINGS_POLICY_UPDATED",
      entityType: "InstitutionSetting",
      newState: body,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
