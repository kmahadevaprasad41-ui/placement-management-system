import { prisma } from "./prisma";

export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
}

export async function checkStudentApplicationPolicy(
  studentId: string,
  targetJobCtcLPA: number
): Promise<PolicyCheckResult> {
  const policy = await prisma.multipleOfferPolicy.findFirst({
    where: { isActive: true },
  });

  if (!policy) {
    return { allowed: true };
  }

  // Check student's current offers
  const existingOffers = await prisma.offer.findMany({
    where: {
      studentId,
      status: { in: ["ISSUED", "ACCEPTED"] },
    },
    orderBy: { ctcLPA: "desc" },
  });

  // If student has already accepted an offer and policy stops them:
  if (policy.stopAfterAcceptedOffer) {
    const acceptedOffer = existingOffers.find((o) => o.status === "ACCEPTED");
    if (acceptedOffer) {
      return {
        allowed: false,
        reason: `You have already accepted an offer with ${acceptedOffer.ctcLPA} LPA. Institutional policy prevents further applications.`,
      };
    }
  }

  // If student reached max offers allowed
  if (existingOffers.length >= policy.maxOffersAllowed) {
    return {
      allowed: false,
      reason: `You have reached the maximum allowed limit of ${policy.maxOffersAllowed} offers.`,
    };
  }

  // If student has an existing offer, check Dream/Multiplier rule
  if (existingOffers.length > 0) {
    const highestExistingOffer = existingOffers[0];
    const minRequiredCtc = highestExistingOffer.ctcLPA * policy.minCtcMultiplierForSecondOffer;

    if (targetJobCtcLPA < minRequiredCtc && targetJobCtcLPA < policy.minAbsoluteCtcForSecondOffer) {
      return {
        allowed: false,
        reason: `Institutional Dream Policy requires a second job offer to be at least ${policy.minCtcMultiplierForSecondOffer}x of your current offer (${highestExistingOffer.ctcLPA} LPA $\\to$ min ${minRequiredCtc.toFixed(1)} LPA) or $\\ge$ ${policy.minAbsoluteCtcForSecondOffer} LPA.`,
      };
    }
  }

  return { allowed: true };
}
