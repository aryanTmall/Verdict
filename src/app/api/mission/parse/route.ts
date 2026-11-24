import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { parseMission } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { text, demo } = await req.json();

    if (demo) {
      const fixturePath = path.join(process.cwd(), "data", "fixtures", "demo-mission.json");
      if (fs.existsSync(fixturePath)) {
        const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
        return NextResponse.json({
          profile: fixture.parsedProfile,
          assumptionsMade: fixture.assumptionsMade,
          clarifyingQuestion: fixture.clarifyingQuestion,
          aiAnswer: "Engineering student profile loaded: Prioritizing 16GB RAM for Docker/Android Studio and balanced battery for daily campus travel. Shortlisting Acer Swift Go 14 OLED, Lenovo Slim 5, and ASUS Vivobook 16.",
          cached: true,
        });
      }
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing mission text input" }, { status: 400 });
    }

    const result = await parseMission(text);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Mission parse error:", err);
    return NextResponse.json({ error: err.message || "Failed to parse mission" }, { status: 500 });
  }
}
