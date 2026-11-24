import { NextResponse } from "next/server";
import {
  generateNewVsUsedMatrix,
  getCategoryInspectionChecklist,
  generateUsedPurchaseRegretTimeline,
  estimateFairUsedPrice,
  calculateUsedDealScore,
  generateNegotiationStrategy,
} from "@/lib/second-hand/estimator";
import { getUsedListingsForProduct } from "@/lib/second-hand/marketplaces";
import type { PurchaseCondition } from "@/lib/second-hand/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    const productName = searchParams.get("name") || decodeURIComponent(id).replace(/-/g, " ");
    const category = searchParams.get("category") || "electronics";
    const newPriceInr = Number(searchParams.get("newPrice")) || 80000;
    const preferredCondition = (searchParams.get("condition") as PurchaseCondition) || "ANY";

    // 1. Generate Matrix
    const matrix = generateNewVsUsedMatrix({
      productName,
      category,
      newPriceInr,
    });

    // 2. Discover Listings
    const listings = getUsedListingsForProduct({
      productName,
      category,
      currentNewPriceInr: newPriceInr,
      preferredCondition,
    });

    // 3. Inspection Checklist
    const checklist = getCategoryInspectionChecklist(category);

    // 4. Regret Horizon
    const regretTimeline = generateUsedPurchaseRegretTimeline(category);

    // 5. Valuation for top listing
    const topListing = listings[0];
    let topListingValuation = null;
    let topListingDealScore = null;
    let topListingNegotiation = null;

    if (topListing) {
      topListingValuation = estimateFairUsedPrice({
        productName,
        category,
        currentNewPriceInr: newPriceInr,
        askingPriceInr: topListing.askingPriceInr,
        ageMonths: topListing.ageMonths,
        condition: topListing.condition,
        hasOriginalInvoice: topListing.hasOriginalInvoice,
        hasBoxAndAccessories: topListing.hasOriginalBoxAndAccessories,
      });

      topListingDealScore = calculateUsedDealScore({
        valuation: topListingValuation,
        condition: topListing.condition,
        sellerRating: topListing.sellerRating,
        isVerifiedSeller: topListing.isVerifiedListing,
        warrantyRemainingMonths: topListing.warrantyRemainingMonths,
        hasOriginalInvoice: topListing.hasOriginalInvoice,
      });

      topListingNegotiation = generateNegotiationStrategy({
        productName,
        category,
        askingPriceInr: topListing.askingPriceInr,
        valuation: topListingValuation,
      });
    }

    return NextResponse.json({
      productId: id,
      productName,
      category,
      preferredCondition,
      matrix,
      listings,
      checklist,
      regretTimeline,
      topListingValuation,
      topListingDealScore,
      topListingNegotiation,
      disclaimer: "VERDICT maintains complete editorial independence. Certified partner affiliations do not influence our deterministic valuation or deal scoring algorithms.",
    });
  } catch (err: any) {
    console.error("Used market API error:", err);
    return NextResponse.json(
      { error: "Failed to evaluate second-hand market intelligence" },
      { status: 500 }
    );
  }
}
