import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, name, firebaseUid } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required for Firebase login." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Look up user by email
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        student: { include: { department: true } },
        recruiter: true,
      },
    });

    // 2. If user doesn't exist yet, auto-provision as STUDENT
    if (!user) {
      const defaultDept = await prisma.department.findFirst({
        where: { code: "CSE" },
      });

      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name || cleanEmail.split("@")[0],
          role: "STUDENT",
          passwordHash: "firebase_authenticated_user",
          student: defaultDept
            ? {
                create: {
                  usn: `FB${Math.floor(1000 + Math.random() * 9000)}`,
                  rollNo: `FB-${Math.floor(100 + Math.random() * 900)}`,
                  batchYear: 2026,
                  currentSem: 8,
                  cgpa: 8.5,
                  tenthPercentage: 88.0,
                  twelfthPercentage: 87.0,
                  activeBacklogs: 0,
                  historyBacklogs: 0,
                  isVerified: true,
                  departmentId: defaultDept.id,
                },
              }
            : undefined,
        },
        include: {
          student: { include: { department: true } },
          recruiter: true,
        },
      });
    }

    // 3. Generate session payload
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
      authProvider: "firebase",
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

    return NextResponse.json({
      success: true,
      message: "Firebase authentication successful",
      user: sessionPayload,
    });
  } catch (err: any) {
    console.error("Firebase login route error:", err);
    return NextResponse.json({ error: err.message || "Firebase login failed" }, { status: 500 });
  }
}
