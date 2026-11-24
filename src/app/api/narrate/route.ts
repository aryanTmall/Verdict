import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { narrateVerdict } from "@/lib/llm";
import type { Evaluation, Verdict } from "@/lib/engine";

export async function POST(req: Request) {
  try {
    const { evaluation, verdict, demo } = (await req.json()) as {
      evaluation: Evaluation;
      verdict: Verdict;
      demo?: boolean;
    };

    if (!evaluation || !verdict) {
      return NextResponse.json({ error: "Missing evaluation or verdict payload" }, { status: 400 });
    }

    if (demo && evaluation.product.slug) {
      const fixturePath = path.join(process.cwd(), "data", "fixtures", "demo-mission.json");
      if (fs.existsSync(fixturePath)) {
        const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
        if (fixture.narration && fixture.narration[evaluation.product.slug]) {
          return NextResponse.json({
            ...fixture.narration[evaluation.product.slug],
            cached: true,
          });
        }
      }
    }

    const narration = await narrateVerdict(evaluation, verdict);
    return NextResponse.json(narration);
  } catch (err: any) {
    console.error("Narration error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate narration" }, { status: 500 });
  }
}
