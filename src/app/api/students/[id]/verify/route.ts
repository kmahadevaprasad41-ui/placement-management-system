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
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "DEPARTMENT_COORDINATOR"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Officer verification rights required." }, { status: 403 });
    }

    const { id } = await context.params;
    const { isVerified, verificationNotes } = await req.json();

    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true, department: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // If Coordinator, ensure department matches
    if (user.role === "DEPARTMENT_COORDINATOR" && user.departmentCode && user.departmentCode !== student.department.code) {
      return NextResponse.json({ error: "You can only verify students in your department." }, { status: 403 });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        isVerified: Boolean(isVerified),
        verificationNotes: verificationNotes || (isVerified ? "Verified by Placement Authority" : "Verification pending documents"),
      },
    });

    // Also verify academic record
    await prisma.academicRecord.updateMany({
      where: { studentId: id },
      data: { isVerified: Boolean(isVerified) },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: isVerified ? "STUDENT_VERIFIED" : "STUDENT_UNVERIFIED",
      entityType: "Student",
      entityId: student.id,
      newState: { isVerified, notes: verificationNotes },
    });

    await createNotification({
      userId: student.userId,
      title: isVerified ? "Academic Profile Verified" : "Verification Status Updated",
      message: isVerified
        ? "Your academic credentials have been verified by the Placement Cell."
        : `Verification update: ${verificationNotes || "Please review missing items."}`,
      type: isVerified ? "SUCCESS" : "WARNING",
      link: "/students/me",
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (err: any) {
    console.error("Student verify API error:", err);
    return NextResponse.json({ error: "Failed to update verification status" }, { status: 500 });
  }
}
