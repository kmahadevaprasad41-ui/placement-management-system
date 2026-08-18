import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, resumeText, targetRole } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const qLower = question.toLowerCase();

    // If Gemini key is set, call Gemini API
    if (geminiApiKey) {
      try {
        const prompt = `You are an elite Placement & Resume AI Career Coach for top tech companies (Google, Microsoft, Amazon).
Candidate Target Role: ${targetRole || "Software Engineer"}
Candidate Resume Context:
${resumeText?.slice(0, 1000) || "Computer Science student with C++, Java, and Distributed Systems experience."}

Student Question: "${question}"

Provide a clear, highly actionable, encouraging answer (2-4 bullet points) with concrete examples or metrics.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answerText) {
            return NextResponse.json({
              success: true,
              answer: answerText,
              engine: "Google Gemini 1.5 Flash Cloud LLM",
            });
          }
        }
      } catch (e) {
        console.warn("Gemini call fallback to heuristic engine:", e);
      }
    }

    // Heuristic Smart Coach Generator
    let answer = "";
    if (qLower.includes("improve") || qLower.includes("score") || qLower.includes("higher")) {
      answer = `To push your ATS compatibility score above 90% for ${targetRole || "Tier-1 Software Engineering"}:
1. **Incorporate Missing Keywords**: Explicitly add competencies like Concurrency, gRPC, and System Design into your project descriptions.
2. **Quantify Every Bullet Point**: Replace passive lines with exact numbers (e.g. "Reduced query latency by 42%", "Handled 50,000+ daily requests").
3. **Highlight Cloud & Containers**: Mention Docker containerization and CI/CD pipelines under your deployment skills.`;
    } else if (qLower.includes("google") || qLower.includes("system design") || qLower.includes("raft")) {
      answer = `For Google Core Systems interviews:
1. **Emphasize Algorithmic Trade-offs**: Be ready to explain why you chose the Raft protocol over Paxos (simpler leader election & state machine safety).
2. **Deep Dive into Failure Scenarios**: Expect questions on network partitions (split-brain handling) and log truncation under crash recovery.
3. **Profile Latency Bottlenecks**: Know your disk I/O write latencies vs network RPC round-trip times down to milliseconds.`;
    } else if (qLower.includes("project") || qLower.includes("build") || qLower.includes("idea")) {
      answer = `High-impact projects that impress technical hiring panels:
1. **Distributed Rate Limiter**: Build a sliding-window rate limiter using Redis and Go/TypeScript supporting 10k req/sec.
2. **High-Throughput Message Queue**: Implement a lightweight persistent pub-sub broker with partition replication.
3. **Custom In-Memory Database**: Create an LSM-tree or B+ Tree storage engine in C++ with WAL (Write-Ahead Logging).`;
    } else {
      answer = `Here is strategic guidance for your campus placement drive:
1. **Focus on STAR Format**: Describe the Situation, Task, Action, and quantified Result in all interview rounds.
2. **Align Resume to Job Description**: Use the same exact terminology as the job posting (e.g., RESTful APIs, Microservices, CI/CD).
3. **Practice Live Coding**: Master Medium/Hard LeetCode problems in Trees, Graphs, Dynamic Programming, and Concurrency.`;
    }

    return NextResponse.json({
      success: true,
      answer,
      engine: "Autonomous Career Heuristic AI Engine (Built-in)",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
