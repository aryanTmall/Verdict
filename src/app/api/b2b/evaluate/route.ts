import { NextResponse } from "next/server";
import { classifyQuery } from "@/lib/domains/classifier";
import { getDomainPack, generateUniversalProducts } from "@/lib/domains/registry";
import { evaluateRealityCheck } from "@/lib/reality-check";

/**
 * VERDICT — B2B Purchasing Intelligence API
 * Exposes product comparison, reality checks, and deterministic scoring to enterprise partners.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    // In production, validate API keys: Bearer vrd_live_...
    const body = await req.json();
    const query = (body.query || "").trim();

    if (!query) {
      return NextResponse.json({ error: "Mission query string is strictly required." }, { status: 400 });
    }

    const classification = classifyQuery(query);
    const realityCheck = evaluateRealityCheck({
      rawQuery: query,
      category: classification.category,
      industry: classification.industry,
      budgetInr: classification.budget,
    });

    const pack = getDomainPack(classification.industry);
    const products = pack.sampleProducts && pack.sampleProducts.length > 0
      ? pack.evaluateProducts(pack.sampleProducts, classification)
      : generateUniversalProducts(classification.category, classification.budget);

    return NextResponse.json({
      success: true,
      apiVersion: "2026-11-B2B",
      classification: {
        industry: classification.industry,
        category: classification.category,
        budgetInr: classification.budget,
        ownershipYears: classification.ownershipYears,
        market: classification.market,
      },
      realityCheck: {
        status: realityCheck.status,
        isRealistic: realityCheck.isRealistic,
        headline: realityCheck.headline,
        marketBaseline: realityCheck.marketContext,
      },
      shortlist: products.slice(0, 3).map((p, idx) => ({
        archetype: idx === 0 ? "BEST_OVERALL" : idx === 1 ? "BEST_VALUE" : "BEST_ALTERNATIVE",
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        priceInr: p.priceInr,
        scores: p.scores,
        tcoEstimatedInr: p.ownership?.tcoBreakdown?.reduce((sum, item) => sum + item.inr, 0) || p.priceInr,
        specsSummary: p.specsSummary,
      })),
      disclaimer: "VERDICT B2B Decision Intelligence API. Deterministic scores calculated without non-deterministic bias.",
    });
  } catch (err: any) {
    console.error("B2B API Error:", err);
    return NextResponse.json({ error: "Internal processing error." }, { status: 500 });
  }
}
