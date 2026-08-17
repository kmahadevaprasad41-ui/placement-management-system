import { EligibilityEvaluationResult, EligibilityCriterion } from "@/types";
import { prisma } from "./prisma";

export async function evaluateStudentEligibility(
  studentId: string,
  jobId: string
): Promise<EligibilityEvaluationResult> {
  // Check for existing manual override first
  const override = await prisma.eligibilityOverride.findUnique({
    where: {
      studentId_jobId: {
        studentId,
        jobId,
      },
    },
  });

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      department: true,
      batch: true,
      academicRecord: true,
      skills: {
        include: { skill: true },
      },
    },
  });

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      eligibilityRule: true,
    },
  });

  if (!student || !job || !job.eligibilityRule) {
    return {
      isEligible: false,
      scorePercentage: 0,
      criteria: [
        {
          label: "Job & Profile Verification",
          required: "Active records",
          actual: "Missing data",
          passed: false,
        },
      ],
    };
  }

  const rule = job.eligibilityRule;
  const acad = student.academicRecord;
  const criteria: EligibilityCriterion[] = [];

  // 1. CGPA Check
  const studentCGPA = acad?.cgpa ?? 0;
  const cgpaPassed = studentCGPA >= rule.minCGPA;
  criteria.push({
    label: "CGPA Requirement",
    required: `≥ ${rule.minCGPA.toFixed(2)}`,
    actual: studentCGPA.toFixed(2),
    passed: cgpaPassed,
    notes: cgpaPassed ? "Meets or exceeds minimum CGPA cutoff." : "CGPA is below the minimum required threshold.",
  });

  // 2. Department Check
  let allowedDepts: string[] = [];
  try {
    allowedDepts = JSON.parse(rule.allowedDepartmentCodes);
  } catch {
    allowedDepts = [rule.allowedDepartmentCodes];
  }
  const deptPassed = allowedDepts.includes(student.department.code);
  criteria.push({
    label: "Eligible Departments",
    required: allowedDepts.join(", "),
    actual: student.department.code,
    passed: deptPassed,
    notes: deptPassed ? "Department is eligible for this role." : "Job is restricted to specific departments.",
  });

  // 3. Active Backlogs Check
  const activeBacklogs = acad?.activeBacklogs ?? 0;
  const backlogsPassed = activeBacklogs <= rule.maxActiveBacklogs;
  criteria.push({
    label: "Active Backlogs",
    required: `≤ ${rule.maxActiveBacklogs}`,
    actual: activeBacklogs,
    passed: backlogsPassed,
    notes: backlogsPassed ? "Within permissible active backlog limit." : "Exceeds active backlog limit.",
  });

  // 4. History Backlogs Check
  const historyBacklogs = acad?.historyBacklogs ?? 0;
  const histPassed = historyBacklogs <= rule.maxHistoryBacklogs;
  criteria.push({
    label: "Historical Backlogs",
    required: `≤ ${rule.maxHistoryBacklogs}`,
    actual: historyBacklogs,
    passed: histPassed,
    notes: histPassed ? "Within historical backlog limit." : "Exceeds historical backlogs cutoff.",
  });

  // 5. Batch / Graduation Year Check
  let allowedBatches: (string | number)[] = [];
  try {
    allowedBatches = JSON.parse(rule.allowedBatchYears);
  } catch {
    allowedBatches = [rule.allowedBatchYears];
  }
  const batchPassed =
    allowedBatches.map(String).includes(String(student.batch.graduationYear)) ||
    allowedBatches.map(String).includes(student.batch.name);
  criteria.push({
    label: "Graduation Batch",
    required: allowedBatches.join(", "),
    actual: String(student.batch.graduationYear),
    passed: batchPassed,
    notes: batchPassed ? "Graduation year matches job requirements." : "Target batch does not match.",
  });

  // 6. 10th & 12th Percentage Check
  if (rule.minTenthPercentage && rule.minTenthPercentage > 0) {
    const tenthActual = acad?.tenthPercentage ?? 0;
    const tenthPassed = tenthActual >= rule.minTenthPercentage;
    criteria.push({
      label: "10th Grade Percentage",
      required: `≥ ${rule.minTenthPercentage}%`,
      actual: `${tenthActual}%`,
      passed: tenthPassed,
      notes: tenthPassed ? "Satisfies secondary schooling cutoff." : "10th score below cutoff.",
    });
  }

  if (rule.minTwelfthPercentage && rule.minTwelfthPercentage > 0) {
    const twelfthActual = acad?.twelfthPercentage ?? acad?.diplomaPercentage ?? 0;
    const twelfthPassed = twelfthActual >= rule.minTwelfthPercentage;
    criteria.push({
      label: "12th / Diploma Percentage",
      required: `≥ ${rule.minTwelfthPercentage}%`,
      actual: `${twelfthActual}%`,
      passed: twelfthPassed,
      notes: twelfthPassed ? "Satisfies higher secondary cutoff." : "12th/Diploma score below cutoff.",
    });
  }

  // 7. Required Skills Check (Optional check)
  if (rule.requiredSkills) {
    let reqSkills: string[] = [];
    try {
      reqSkills = JSON.parse(rule.requiredSkills);
    } catch {
      reqSkills = rule.requiredSkills.split(",").map((s) => s.trim());
    }

    if (reqSkills.length > 0) {
      const studentSkillNames = student.skills.map((s) => s.skill.name.toLowerCase());
      const matched = reqSkills.filter((sk) => studentSkillNames.includes(sk.toLowerCase()));
      const skillsPassed = matched.length > 0; // at least 1 core match or all

      criteria.push({
        label: "Required Technical Skills",
        required: reqSkills.join(", "),
        actual: student.skills.map((s) => s.skill.name).slice(0, 4).join(", ") || "None listed",
        passed: skillsPassed,
        notes: skillsPassed
          ? `Matched: ${matched.join(", ")}`
          : "None of the specified core skills found on profile.",
      });
    }
  }

  const passedCount = criteria.filter((c) => c.passed).length;
  const scorePercentage = Math.round((passedCount / criteria.length) * 100);
  const naturalEligible = criteria.every((c) => c.passed);

  if (override) {
    return {
      isEligible: true,
      scorePercentage,
      criteria,
      overridden: true,
      overrideReason: override.reason,
    };
  }

  return {
    isEligible: naturalEligible,
    scorePercentage,
    criteria,
    overridden: false,
  };
}
