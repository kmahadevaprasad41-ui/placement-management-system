import { prisma } from "./prisma";

export interface LogAuditParams {
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: LogAuditParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        userEmail: params.userEmail ?? null,
        userRole: params.userRole ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        previousState: params.previousState ? JSON.stringify(params.previousState) : null,
        newState: params.newState ? JSON.stringify(params.newState) : null,
        ipAddress: params.ipAddress ?? "127.0.0.1",
        userAgent: params.userAgent ?? "PMS-WebClient",
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
    return null;
  }
}
