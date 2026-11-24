import { NextResponse } from "next/server";
import { getPriceRadarReport } from "@/lib/price-radar";
import { getCatalog } from "@/lib/catalog";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const catalog = getCatalog();
    const product = catalog.find((p) => p.slug === id) || {
      slug: id,
      name: id.replace(/-/g, " "),
      priceInr: 75000,
    };

    const report = getPriceRadarReport(product);
    return NextResponse.json({
      productId: id,
      priceHistory: report.priceHistory,
      lowestEverInr: report.lowestEverPriceInr,
      highestInr: report.highestPriceInr,
      averageInr: report.averagePriceInr,
      priceRecommendation: report.priceRecommendation,
      reason: report.recommendationReason,
    });
  } catch (err: any) {
    console.error("Price history API error:", err);
    return NextResponse.json({ error: "Failed to retrieve price history" }, { status: 500 });
  }
}
