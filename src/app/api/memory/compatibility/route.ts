import { NextResponse } from "next/server";
import { computePersonalFit, DEFAULT_USER_ID } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productName,
      category = "laptop",
      industry = "electronics",
      priceInr = 50000,
      specs = {},
      objectiveScore = 80,
      userId = DEFAULT_USER_ID,
    } = body;

    if (!productName) {
      return NextResponse.json({ error: "Missing productName" }, { status: 400 });
    }

    const fitResult = computePersonalFit({
      productName,
      category,
      industry,
      priceInr,
      specs,
      objectiveScore,
      userId,
    });

    return NextResponse.json({ success: true, ...fitResult });
  } catch (err: any) {
    console.error("Compatibility evaluation error:", err);
    return NextResponse.json({ error: err.message || "Failed to evaluate compatibility" }, { status: 500 });
  }
}
