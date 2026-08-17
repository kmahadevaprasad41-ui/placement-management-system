import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentId) {
      return NextResponse.json({ error: "Only the recipient student can respond to this offer." }, { status: 403 });
    }

    const { id: offerId } = await context.params;
    const body = await req.json();
    const { action, remarks } = body; // action: "ACCEPT" | "REJECT"

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Action must be ACCEPT or REJECT" }, { status: 400 });
    }

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        company: true,
        job: true,
        student: { include: { user: true } },
      },
    });

    if (!offer || offer.studentId !== user.studentId) {
      return NextResponse.json({ error: "Offer not found or unauthorized" }, { status: 404 });
    }

    if (offer.status !== "ISSUED") {
      return NextResponse.json({ error: `Offer is already in ${offer.status} state.` }, { status: 400 });
    }

    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOffer = await tx.offer.update({
        where: { id: offerId },
        data: {
          status: newStatus,
          studentResponseAt: new Date(),
          studentRemarks: remarks || (action === "ACCEPT" ? "Offer formally accepted by candidate." : "Offer declined."),
        },
      });

      if (action === "ACCEPT") {
        // Create Joining record
        await tx.joiningRecord.upsert({
          where: { offerId },
          create: {
            offerId,
            studentId: user.studentId!,
            status: "EXPECTED",
            actualJoiningDate: offer.joiningDate || new Date("2027-07-01"),
            location: offer.job.location,
            verificationNotes: "Automatic pre-joining onboarding initiated.",
          },
          update: {
            status: "EXPECTED",
          },
        });

        // Update student placement status to PLACED
        await tx.student.update({
          where: { id: user.studentId! },
          data: { placementStatus: "PLACED" },
        });

        // Update application stage to ACCEPTED
        await tx.application.updateMany({
          where: { studentId: user.studentId!, jobId: offer.jobId },
          data: { currentStage: "OFFERED", status: "ACCEPTED" },
        });
      }

      return updatedOffer;
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: "STUDENT",
      action: action === "ACCEPT" ? "OFFER_ACCEPTED" : "OFFER_REJECTED",
      entityType: "Offer",
      entityId: offer.id,
      newState: { status: newStatus, remarks },
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (err: any) {
    console.error("Offer response error:", err);
    return NextResponse.json({ error: "Failed to process offer response" }, { status: 500 });
  }
}
