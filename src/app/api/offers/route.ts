import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

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

    if (user.role === "STUDENT" && user.studentId) {
      where.studentId = user.studentId;
    } else if (user.role === "RECRUITER" && user.companyId) {
      where.companyId = user.companyId;
    }

    const offers = await prisma.offer.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true, avatarUrl: true } },
            department: true,
            academicRecord: true,
          },
        },
        job: true,
        company: true,
        joiningRecord: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const activePolicy = await prisma.multipleOfferPolicy.findFirst({
      where: { isActive: true },
    });

    return NextResponse.json({ offers, policy: activePolicy });
  } catch (err: any) {
    console.error("Offers list error:", err);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Offer rollout authority required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      studentId,
      jobId,
      selectionId,
      ctcLPA,
      baseSalary,
      variableSalary,
      joiningDate,
      expiryDate,
      documentUrl,
    } = body;

    if (!studentId || !jobId || !ctcLPA) {
      return NextResponse.json({ error: "Student ID, Job ID, and CTC are required." }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!job || !student) {
      return NextResponse.json({ error: "Job or Student not found" }, { status: 404 });
    }

    const offerNumber = `OFFER-${job.company.slug.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const offer = await prisma.$transaction(async (tx) => {
      const createdOffer = await tx.offer.create({
        data: {
          studentId,
          jobId,
          companyId: job.companyId,
          selectionId: selectionId || null,
          offerLetterNumber: offerNumber,
          ctcLPA: parseFloat(ctcLPA),
          baseSalary: baseSalary ? parseFloat(baseSalary) : undefined,
          variableSalary: variableSalary ? parseFloat(variableSalary) : undefined,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date("2027-07-01"),
          expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 14 * 86400000),
          documentUrl: documentUrl || `/documents/offers/${offerNumber}.pdf`,
          status: "ISSUED",
        },
      });

      // Update application stage to OFFERED
      await tx.application.updateMany({
        where: { studentId, jobId },
        data: { currentStage: "OFFERED" },
      });

      return createdOffer;
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "OFFER_ISSUED",
      entityType: "Offer",
      entityId: offer.id,
      newState: { studentName: student.user.name, company: job.company.name, ctcLPA },
    });

    await createNotification({
      userId: student.userId,
      title: `Official Offer Letter Released — ${job.company.name}`,
      message: `Congratulations! ${job.company.name} has extended an official offer of ₹${ctcLPA} LPA for ${job.title}. Review your offer letter now.`,
      type: "OFFER",
      link: "/offers",
    });

    return NextResponse.json({ success: true, offer });
  } catch (err: any) {
    console.error("Offer rollout error:", err);
    return NextResponse.json({ error: "Failed to release offer" }, { status: 500 });
  }
}
