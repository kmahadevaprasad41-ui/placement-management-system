import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStudentProfileCompletion } from "@/lib/profile-engine";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const studentId = id === "me" ? user.studentId : id;
    if (!studentId || (user.role === "STUDENT" && user.studentId !== studentId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, fileName, fileSize, mimeType, setAsDefault } = body;

    if (setAsDefault) {
      await prisma.resume.updateMany({
        where: { studentId },
        data: { isDefault: false },
      });
    }

    const resume = await prisma.resume.create({
      data: {
        studentId,
        title: title || `${fileName || "Resume"}.pdf`,
        fileName: fileName || "resume.pdf",
        fileUrl: `/uploads/resumes/${studentId}_${Date.now()}.pdf`,
        fileSize: fileSize || 350000,
        mimeType: mimeType || "application/pdf",
        isDefault: setAsDefault ?? true,
      },
    });

    await calculateStudentProfileCompletion(studentId);

    return NextResponse.json({ success: true, resume });
  } catch (err: any) {
    console.error("Resume creation API error:", err);
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}
