import { prisma } from "./src/lib/prisma";
import { evaluateStudentEligibility } from "./src/lib/eligibility-engine";

async function diag() {
  const aaravUser = await prisma.user.findUnique({ where: { email: "student.aarav@institution.edu" } });
  const aaravStudent = await prisma.student.findUnique({
    where: { userId: aaravUser!.id },
    include: { department: true, batch: true, academicRecord: true, skills: { include: { skill: true } } },
  });
  const googleJob = await prisma.job.findFirst({ where: { company: { slug: "google" } }, include: { eligibilityRule: true } });

  console.log("Aarav Student:", aaravStudent);
  console.log("Google Job:", googleJob);

  const res = await evaluateStudentEligibility(aaravStudent!.id, googleJob!.id);
  console.log("Evaluation Result:", JSON.stringify(res, null, 2));
}

diag().finally(() => prisma.$disconnect());
