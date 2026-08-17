export type Role =
  | "SUPER_ADMIN"
  | "PLACEMENT_OFFICER"
  | "DEPARTMENT_COORDINATOR"
  | "STUDENT"
  | "RECRUITER"
  | "MANAGEMENT";

export type ApplicationStage =
  | "APPLIED"
  | "SHORTLISTED"
  | "TEST"
  | "INTERVIEW"
  | "SELECTED"
  | "OFFERED"
  | "JOINED"
  | "REJECTED"
  | "WITHDRAWN";

export type PlacementStatus = "UNPLACED" | "IN_PROCESS" | "PLACED" | "OPTED_OUT";

export type JobType = "FULL_TIME" | "INTERNSHIP_TO_PPO" | "INTERNSHIP";
export type WorkMode = "ON_SITE" | "REMOTE" | "HYBRID";
export type CompanyStatus = "PROSPECT" | "REGISTERED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED" | "INACTIVE";
export type CompanyTier = "TIER_1" | "TIER_2" | "TIER_3";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  studentId?: string | null;
  recruiterId?: string | null;
  companyId?: string | null;
  departmentCode?: string | null;
}

export interface EligibilityCriterion {
  label: string;
  required: string | number;
  actual: string | number;
  passed: boolean;
  notes?: string;
}

export interface EligibilityEvaluationResult {
  isEligible: boolean;
  scorePercentage: number;
  criteria: EligibilityCriterion[];
  overridden?: boolean;
  overrideReason?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictDetails?: {
    type: "INTERVIEW" | "TEST";
    title: string;
    scheduledStart: string;
    scheduledEnd: string;
  };
}

export interface ProfileCompletionBreakdown {
  totalPercentage: number;
  categories: {
    name: string;
    weight: number;
    completed: boolean;
    earned: number;
    actionRequired?: string;
  }[];
}
