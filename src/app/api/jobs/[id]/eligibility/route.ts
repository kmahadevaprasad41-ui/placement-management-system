import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { evaluateStudentEligibility } from "@/lib/eligibility-engine";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await context.params;
    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get("studentId") || user.studentId;

    if (!targetStudentId) {
      return NextResponse.json({ error: "Student ID required for eligibility check" }, { status: 400 });
    }

    const evaluation = await evaluateStudentEligibility(targetStudentId, jobId);

    return NextResponse.json({ evaluation });
  } catch (err: any) {
    console.error("Eligibility check API error:", err);
    return NextResponse.json({ error: "Failed to evaluate eligibility" }, { status: 500 });
  }
}
