import { NextResponse } from "next/server";
import { answerContextualQuestion } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { question, context } = await req.json();
    if (!question || !context) {
      return NextResponse.json({ error: "Question and decision context are required" }, { status: 400 });
    }

    const response = await answerContextualQuestion(question, context);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Ask API error:", err);
    return NextResponse.json({
      answer: "I can't verify that from the evidence I have.",
      citations: ["Evidence Vault [VERIFIED]"],
    });
  }
}
