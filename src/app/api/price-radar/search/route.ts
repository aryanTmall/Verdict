import { NextResponse } from "next/server";
import { getPriceRadarReport } from "@/lib/price-radar";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = body.product || {
      name: body.query || "Audited Product",
      priceInr: body.budgetInr || 75000,
      industry: body.industry || "general",
    };

    const report = getPriceRadarReport(product);
    return NextResponse.json(report);
  } catch (err: any) {
    console.error("Price radar API error:", err);
    return NextResponse.json({ error: "Failed to generate price radar report" }, { status: 500 });
  }
}
