import { NextResponse } from "next/server";
import { extractMemoriesFromText, DEFAULT_USER_ID } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const { text, userId = DEFAULT_USER_ID, autoCommitExplicit = true } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text for memory extraction" }, { status: 400 });
    }

    const result = extractMemoriesFromText(text, userId, { autoCommitExplicit });
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Memory extraction error:", err);
    return NextResponse.json({ error: err.message || "Failed to extract memory" }, { status: 500 });
  }
}
