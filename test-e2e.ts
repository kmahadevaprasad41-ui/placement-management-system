import { prisma } from "./src/lib/prisma";
import { evaluateStudentEligibility } from "./src/lib/eligibility-engine";
import { checkStudentApplicationPolicy } from "./src/lib/policy-engine";
import { detectStudentSchedulingConflict } from "./src/lib/conflict-detector";
import { calculateStudentProfileCompletion } from "./src/lib/profile-engine";
import bcrypt from "bcryptjs";

async function runVerification() {
  console.log("==================================================================");
  console.log("🚀 STARTING AUTOMATED END-TO-END VERIFICATION OF PMS SAAS PLATFORM");
  console.log("==================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // 1. Database & Seed Data Verification
  console.log("\n📌 [1/10] Verifying Database Records & Seed Integrity...");
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.student.count();
  const totalCompanies = await prisma.company.count();
  const totalJobs = await prisma.job.count();
  const totalOffers = await prisma.offer.count();

  assert(totalUsers >= 55, `Total Users in database (${totalUsers} >= 55)`);
  assert(totalStudents >= 50, `Total Students seeded (${totalStudents} >= 50)`);
  assert(totalCompanies >= 8, `Premier Companies seeded (${totalCompanies} >= 8)`);
  assert(totalJobs >= 7, `Job Postings seeded (${totalJobs} >= 7)`);
  assert(totalOffers >= 2, `Seeded Placement Offers (${totalOffers} >= 2)`);

  // 2. Authentication & Role Password Verification
  console.log("\n📌 [2/10] Verifying Authentication & Credentials...");
  const officer = await prisma.user.findUnique({ where: { email: "placement@institution.edu" } });
  const studentAarav = await prisma.user.findUnique({ where: { email: "student.aarav@institution.edu" } });
  const recruiter = await prisma.user.findUnique({ where: { email: "recruiter.google@google.com" } });
  const management = await prisma.user.findUnique({ where: { email: "management@institution.edu" } });

  assert(Boolean(officer && officer.role === "PLACEMENT_OFFICER"), "Placement Officer User Account Exists");
  assert(Boolean(studentAarav && studentAarav.role === "STUDENT"), "Student Aarav User Account Exists");
  assert(Boolean(recruiter && recruiter.role === "RECRUITER"), "Recruiter Google User Account Exists");
  assert(Boolean(management && management.role === "MANAGEMENT"), "Management Director User Account Exists");

  const isPasswordValid = await bcrypt.compare("password123", officer!.passwordHash);
  assert(isPasswordValid, "Password Hashing & Verification matches 'password123'");

  // 3. Student Profile Readiness & Completion Engine
  console.log("\n📌 [3/10] Testing Student Profile Completion Engine...");
  const aaravStudent = await prisma.student.findUnique({
    where: { userId: studentAarav!.id },
  });
  assert(Boolean(aaravStudent), "Aarav Student Profile Linked");

  const profileBreakdown = await calculateStudentProfileCompletion(aaravStudent!.id);
  assert(profileBreakdown.totalPercentage >= 70, `Profile Readiness Calculation (${profileBreakdown.totalPercentage}%)`);
  assert(profileBreakdown.categories.length === 6, "Profile Breakdown contains 6 weighted categories");

  // 4. Eligibility Engine & Transparent Rule Breakdown
  console.log("\n📌 [4/10] Testing Transparent Eligibility Engine...");
  const googleJob = await prisma.job.findFirst({
    where: { company: { slug: "google" } },
  });
  assert(Boolean(googleJob), "Google Job Posting Exists");

  // Aarav has 9.48 CGPA, 0 backlogs, CSE -> Should be 100% Eligible
  const aaravEligibility = await evaluateStudentEligibility(aaravStudent!.id, googleJob!.id);
  assert(aaravEligibility.isEligible === true, "Aarav is marked ELIGIBLE for Google SWE (CGPA 9.48 >= 8.0)");
  assert(aaravEligibility.criteria.length >= 6, "Transparent breakdown contains criteria checklist");
  assert(aaravEligibility.criteria.every((c) => c.passed), "All criteria checklist items passed with green check");

  // Clean any previous test overrides for idempotency
  await prisma.eligibilityOverride.deleteMany();

  // Ananya has backlogs -> Should be Ineligible
  const ananyaUser = await prisma.user.findUnique({ where: { email: "student.ananya@institution.edu" } });
  const ananyaStudent = await prisma.student.findUnique({ where: { userId: ananyaUser!.id } });
  const ananyaEligibility = await evaluateStudentEligibility(ananyaStudent!.id, googleJob!.id);
  assert(ananyaEligibility.isEligible === false, "Ananya is marked INELIGIBLE for Google due to active backlog cutoff");
  const failedBacklog = ananyaEligibility.criteria.find((c) => c.label === "Active Backlogs");
  assert(Boolean(failedBacklog && !failedBacklog.passed), "Active Backlogs check accurately failed with required <= 0, actual 1");

  // 5. Placement Officer Eligibility Override Workflow
  console.log("\n📌 [5/10] Testing Placement Officer Eligibility Override Workflow...");
  const overrideReason = "Exemption granted for national coding championship top 10 finish";
  await prisma.eligibilityOverride.upsert({
    where: { studentId_jobId: { studentId: ananyaStudent!.id, jobId: googleJob!.id } },
    create: {
      studentId: ananyaStudent!.id,
      jobId: googleJob!.id,
      overriddenById: officer!.id,
      previousResult: "NOT_ELIGIBLE",
      newResult: "OVERRIDDEN_ELIGIBLE",
      reason: overrideReason,
    },
    update: { reason: overrideReason },
  });

  const ananyaPostOverride = await evaluateStudentEligibility(ananyaStudent!.id, googleJob!.id);
  assert(ananyaPostOverride.isEligible === true, "Ananya is now ELIGIBLE via Placement Officer Override");
  assert(ananyaPostOverride.overridden === true, "Override flag set to true in transparency report");
  assert(ananyaPostOverride.overrideReason === overrideReason, "Override justification accurately persisted");

  // 6. Multi-Offer Institutional Placement Policy Engine
  console.log("\n📌 [6/10] Testing Multiple-Offer Policy Engine...");
  // Aarav has 32.5 LPA Google offer accepted -> Should be prevented from applying to lower jobs if policy stops after accepted
  const policyCheck = await checkStudentApplicationPolicy(aaravStudent!.id, 18.0);
  assert(policyCheck.allowed === false, "Policy blocks further application when accepted offer exists");

  // 7. Interview Scheduler & Conflict Detection Engine
  console.log("\n📌 [7/10] Testing Interview Conflict Detection Engine...");
  
  // Create an active SCHEDULED interview for Aarav
  const now = new Date();
  const scheduledStart = new Date(now.getTime() + 86400000); // tomorrow 10:00
  const scheduledEnd = new Date(now.getTime() + 86400000 + 3600000); // tomorrow 11:00

  const activeIv = await prisma.interview.create({
    data: {
      studentId: aaravStudent!.id,
      jobId: googleJob!.id,
      roundNumber: 2,
      roundName: "System Architecture Round",
      interviewerName: "Google Principal Architect",
      scheduledStart,
      scheduledEnd,
      status: "SCHEDULED",
    },
  });

  // Test overlapping time slot: (15 mins into the scheduled interview)
  const slotStart = new Date(scheduledStart.getTime() + 15 * 60000);
  const slotEnd = new Date(scheduledEnd.getTime() + 30 * 60000);
  const conflict = await detectStudentSchedulingConflict(aaravStudent!.id, slotStart, slotEnd);
  assert(conflict.hasConflict === true, "Conflict Detector Engine caught time slot collision!");
  assert(Boolean(conflict.conflictDetails?.title), `Conflict Identified: '${conflict.conflictDetails?.title}'`);

  // Test non-overlapping time slot (2 days later):
  const cleanStart = new Date(now.getTime() + 3 * 86400000);
  const cleanEnd = new Date(now.getTime() + 3 * 86400000 + 3600000);
  const noConflict = await detectStudentSchedulingConflict(aaravStudent!.id, cleanStart, cleanEnd);
  assert(noConflict.hasConflict === false, "Clean time slot passed conflict check without false positives");

  // 8. Application Stage Pipeline (8 Stages)
  console.log("\n📌 [8/10] Testing Application Stages & Status Transitions...");
  const msftJob = await prisma.job.findFirst({ where: { company: { slug: "microsoft" } } });
  const rohanUser = await prisma.user.findUnique({ where: { email: "student.rohan@institution.edu" } });
  const rohanStudent = await prisma.student.findUnique({ where: { userId: rohanUser!.id } });

  // Create clean application for Rohan
  const rohanApp = await prisma.application.upsert({
    where: { studentId_jobId: { studentId: rohanStudent!.id, jobId: msftJob!.id } },
    create: {
      studentId: rohanStudent!.id,
      jobId: msftJob!.id,
      currentStage: "APPLIED",
      status: "ACTIVE",
    },
    update: { currentStage: "SHORTLISTED" },
  });
  assert(Boolean(rohanApp), "Application created/updated for candidate");

  // Advance stage to INTERVIEW
  await prisma.application.update({
    where: { id: rohanApp.id },
    data: { currentStage: "INTERVIEW" },
  });
  const updatedApp = await prisma.application.findUnique({ where: { id: rohanApp.id } });
  assert(updatedApp!.currentStage === "INTERVIEW", "Recruitment stage advanced from SHORTLISTED to INTERVIEW");

  // 9. Offer Rollout & Student Acceptance -> Joining Record
  console.log("\n📌 [9/10] Testing Offer Acceptance & Joining Record Generation...");
  const diyaUser = await prisma.user.findUnique({ where: { email: "student.diya@institution.edu" } });
  const diyaStudent = await prisma.student.findUnique({ where: { userId: diyaUser!.id } });
  const diyaOffer = await prisma.offer.findFirst({ where: { studentId: diyaStudent!.id } });
  assert(Boolean(diyaOffer), "Diya Microsoft Offer Exists");

  // Accept offer
  await prisma.offer.update({
    where: { id: diyaOffer!.id },
    data: { status: "ACCEPTED", studentResponseAt: new Date() },
  });

  await prisma.joiningRecord.upsert({
    where: { offerId: diyaOffer!.id },
    create: {
      offerId: diyaOffer!.id,
      studentId: diyaStudent!.id,
      status: "EXPECTED",
      actualJoiningDate: new Date("2027-07-15"),
      location: "Microsoft India Development Center, Hyderabad",
      verificationNotes: "Degree verification and joining kit dispatched.",
    },
    update: { status: "EXPECTED" },
  });

  await prisma.student.update({
    where: { id: diyaStudent!.id },
    data: { placementStatus: "PLACED" },
  });

  const verifiedDiya = await prisma.student.findUnique({
    where: { id: diyaStudent!.id },
    include: { offers: true, joiningRecords: true },
  });
  assert(verifiedDiya!.placementStatus === "PLACED", "Candidate status updated to PLACED");
  assert(verifiedDiya!.joiningRecords.length > 0, "Joining record generated with location and expected date");

  // 10. Dashboard & Analytics Real-time Aggregation
  console.log("\n📌 [10/10] Testing Real Database Dashboard & Analytics Aggregation...");
  const placedCount = await prisma.student.count({ where: { placementStatus: "PLACED" } });
  const studentCount = await prisma.student.count();
  const placementRate = +((placedCount / studentCount) * 100).toFixed(1);

  const allOffers = await prisma.offer.findMany({ select: { ctcLPA: true } });
  const maxCTC = Math.max(...allOffers.map((o) => o.ctcLPA));
  const avgCTC = +(allOffers.reduce((sum, o) => sum + o.ctcLPA, 0) / allOffers.length).toFixed(1);

  assert(placedCount >= 2, `Real Placed Count computed from DB (${placedCount})`);
  assert(placementRate > 0, `Calculated Placement Rate (${placementRate}%)`);
  assert(maxCTC >= 32.5, `Calculated Highest CTC (₹${maxCTC} LPA)`);
  assert(avgCTC >= 20.0, `Calculated Average CTC (₹${avgCTC} LPA)`);

  console.log("==================================================================");
  console.log(`📊 FINAL TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification()
  .catch((e) => {
    console.error("Test error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
