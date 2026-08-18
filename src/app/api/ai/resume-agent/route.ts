import { NextResponse } from "next/server";
import { runResumeAIAgent, AIAgentAuditRequest } from "@/lib/ai-agent";

export async function POST(req: Request) {
  try {
    const body: AIAgentAuditRequest = await req.json();

    if (!body.resumeText || !body.resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text content is required for AI Agent audit." },
        { status: 400 }
      );
    }

    const auditResult = await runResumeAIAgent(body);

    return NextResponse.json({
      success: true,
      data: auditResult,
    });
  } catch (error: any) {
    console.error("AI Resume Agent API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute AI Resume Agent audit." },
      { status: 500 }
    );
  }
}
