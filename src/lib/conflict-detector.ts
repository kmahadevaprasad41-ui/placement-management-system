import { ConflictCheckResult } from "@/types";
import { prisma } from "./prisma";

export async function detectStudentSchedulingConflict(
  studentId: string,
  newStart: Date,
  newEnd: Date,
  excludeInterviewId?: string
): Promise<ConflictCheckResult> {
  // 1. Check existing scheduled interviews
  const interviews = await prisma.interview.findMany({
    where: {
      studentId,
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      ...(excludeInterviewId ? { id: { not: excludeInterviewId } } : {}),
    },
    include: {
      job: {
        include: { company: true },
      },
    },
  });

  for (const iv of interviews) {
    const ivStart = new Date(iv.scheduledStart).getTime();
    const ivEnd = new Date(iv.scheduledEnd).getTime();
    const targetStart = newStart.getTime();
    const targetEnd = newEnd.getTime();

    // Check overlap: (StartA < EndB) and (EndA > StartB)
    if (targetStart < ivEnd && targetEnd > ivStart) {
      return {
        hasConflict: true,
        conflictDetails: {
          type: "INTERVIEW",
          title: `${iv.job.company.name} - ${iv.roundName}`,
          scheduledStart: new Date(iv.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          scheduledEnd: new Date(iv.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }
  }

  return { hasConflict: false };
}
