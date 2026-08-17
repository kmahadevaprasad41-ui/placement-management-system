import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role, SessionUser } from "@/types";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "placement-secret-key-2026";
const COOKIE_NAME = "pms_session_token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifySessionToken(token);
    if (!decoded || !decoded.id) return null;

    // Optional: Refresh verification against active user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        student: {
          include: { department: true },
        },
        recruiter: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      avatarUrl: user.avatarUrl,
      studentId: user.student?.id ?? null,
      recruiterId: user.recruiter?.id ?? null,
      companyId: user.recruiter?.companyId ?? null,
      departmentCode: user.student?.department.code ?? null,
    };
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}

export async function requireAuth(allowedRoles?: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
