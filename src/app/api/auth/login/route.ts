import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signSessionToken, verifyPassword } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        student: { include: { department: true } },
        recruiter: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials or deactivated account." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
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

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
    });

    return NextResponse.json({ success: true, user: sessionPayload });
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
