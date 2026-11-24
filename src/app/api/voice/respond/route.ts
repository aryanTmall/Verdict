import { NextResponse } from "next/server";
import { getLocalizedVerbalVerdict } from "@/lib/multilingual";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = getLocalizedVerbalVerdict({
      productName: body.productName || "Audited Product",
      verdictKind: body.verdictKind || "CAUTION",
      priceInr: Number(body.priceInr || 75000),
      keyFinding: body.keyFinding || "Tested against verified owner receipts with zero vibe math.",
      languageCode: body.languageCode || "hi-IN",
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Voice respond error:", err);
    return NextResponse.json({ error: "Failed to generate spoken response" }, { status: 500 });
  }
}
