import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        student: { include: { department: true } },
        recruiter: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Test user account not found." }, { status: 404 });
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      avatarUrl: user.avatarUrl,
      studentId: user.student?.id ?? null,
      recruiterId: user.recruiter?.id ?? null,
      companyId: user.recruiter?.companyId ?? null,
      departmentCode: user.student?.department.code ?? null,
    };

    const token = signSessionToken(sessionPayload);

    const cookieStore = await cookies();
    cookieStore.set("pms_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true, user: sessionPayload });
  } catch (err) {
    console.error("Quick login error:", err);
    return NextResponse.json({ error: "Failed to switch role" }, { status: 500 });
  }
}
