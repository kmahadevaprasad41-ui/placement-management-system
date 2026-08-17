import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateStudentEligibility } from "@/lib/eligibility-engine";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const workMode = searchParams.get("workMode") || "";
    const tab = searchParams.get("tab") || "all"; // all, eligible, applied, closing_soon
    const companyId = searchParams.get("companyId") || "";

    const where: any = {};

    // Recruiter scoping
    if (user.role === "RECRUITER" && user.companyId) {
      where.companyId = user.companyId;
    } else if (companyId) {
      where.companyId = companyId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { role: { contains: search } },
        { company: { name: { contains: search } } },
      ];
    }

    if (workMode) {
      where.workMode = workMode;
    }

    // Only students and public see published, officers/recruiters see all
    if (user.role === "STUDENT") {
      where.status = "PUBLISHED";
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: true,
        eligibilityRule: true,
        applications: {
          select: {
            id: true,
            studentId: true,
            currentStage: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // If student, compute eligibility and applied status for each job
    if (user.role === "STUDENT" && user.studentId) {
      const studentId = user.studentId;
      const enrichedJobs = await Promise.all(
        jobs.map(async (job) => {
          const hasApplied = job.applications.some((a) => a.studentId === studentId);
          const studentApp = job.applications.find((a) => a.studentId === studentId);
          const eligibility = await evaluateStudentEligibility(studentId, job.id);

          return {
            ...job,
            hasApplied,
            applicationStage: studentApp?.currentStage ?? null,
            eligibility,
          };
        })
      );

      // Filter by tab if requested
      let filteredJobs = enrichedJobs;
      if (tab === "eligible") {
        filteredJobs = enrichedJobs.filter((j) => j.eligibility.isEligible);
      } else if (tab === "applied") {
        filteredJobs = enrichedJobs.filter((j) => j.hasApplied);
      } else if (tab === "closing_soon") {
        const soon = new Date(Date.now() + 7 * 86400000);
        filteredJobs = enrichedJobs.filter((j) => new Date(j.deadline) <= soon);
      }

      return NextResponse.json({ jobs: filteredJobs });
    }

    return NextResponse.json({ jobs });
  } catch (err: any) {
    console.error("Jobs list API error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Job posting privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      companyId,
      title,
      role,
      description,
      requirements,
      jobType,
      workMode,
      location,
      ctcLPA,
      baseSalaryLPA,
      variableSalaryLPA,
      vacancies,
      deadline,
      status,
      eligibility,
    } = body;

    const finalCompanyId = user.role === "RECRUITER" ? user.companyId! : companyId;
    if (!finalCompanyId || !title || !ctcLPA || !deadline) {
      return NextResponse.json({ error: "Company, Title, CTC, and Deadline are required" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        companyId: finalCompanyId,
        title,
        role: role || title,
        description: description || "Role description pending.",
        requirements,
        jobType: jobType || "FULL_TIME",
        workMode: workMode || "HYBRID",
        location: location || "Bangalore / Remote",
        ctcLPA: parseFloat(ctcLPA),
        baseSalaryLPA: baseSalaryLPA ? parseFloat(baseSalaryLPA) : undefined,
        variableSalaryLPA: variableSalaryLPA ? parseFloat(variableSalaryLPA) : undefined,
        vacancies: vacancies ? parseInt(vacancies) : 5,
        deadline: new Date(deadline),
        status: status || (user.role === "RECRUITER" ? "UNDER_REVIEW" : "PUBLISHED"),
        createdById: user.id,
      },
    });

    if (eligibility) {
      await prisma.jobEligibilityRule.create({
        data: {
          jobId: job.id,
          minCGPA: eligibility.minCGPA ? parseFloat(eligibility.minCGPA) : 6.0,
          allowedDepartmentCodes: JSON.stringify(eligibility.allowedDepartmentCodes || ["CSE", "IT", "ECE"]),
          allowedBatchYears: JSON.stringify(eligibility.allowedBatchYears || [2027]),
          maxActiveBacklogs: eligibility.maxActiveBacklogs !== undefined ? parseInt(eligibility.maxActiveBacklogs) : 0,
          maxHistoryBacklogs: eligibility.maxHistoryBacklogs !== undefined ? parseInt(eligibility.maxHistoryBacklogs) : 2,
          minTenthPercentage: eligibility.minTenthPercentage ? parseFloat(eligibility.minTenthPercentage) : 60.0,
          minTwelfthPercentage: eligibility.minTwelfthPercentage ? parseFloat(eligibility.minTwelfthPercentage) : 60.0,
          requiredSkills: eligibility.requiredSkills ? JSON.stringify(eligibility.requiredSkills) : null,
          customNotes: eligibility.customNotes,
        },
      });
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "JOB_CREATED",
      entityType: "Job",
      entityId: job.id,
      newState: { title: job.title, ctcLPA: job.ctcLPA },
    });

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error("Create job API error:", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
