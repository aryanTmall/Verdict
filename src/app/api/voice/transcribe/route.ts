import { NextResponse } from "next/server";
import { detectIndianLanguage } from "@/lib/multilingual";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawTranscript = body.transcript || body.text || "";

    if (!rawTranscript.trim()) {
      return NextResponse.json({ error: "Transcript is empty" }, { status: 400 });
    }

    const detectedLang = detectIndianLanguage(rawTranscript);

    return NextResponse.json({
      transcript: rawTranscript,
      detectedLanguage: detectedLang,
      isHinglish: detectedLang.code === "hi-Latn",
      suggestedMissionText: rawTranscript,
    });
  } catch (err: any) {
    console.error("Voice transcribe error:", err);
    return NextResponse.json({ error: "Transcription processing failed" }, { status: 500 });
  }
}
