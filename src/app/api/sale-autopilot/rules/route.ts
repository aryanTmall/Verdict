import { NextResponse } from "next/server";
import { getPurchaseRules, createPurchaseRule } from "@/lib/sale-autopilot";

export async function GET() {
  const rules = getPurchaseRules();
  return NextResponse.json({ rules });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.productId || !body.targetPriceInr) {
      return NextResponse.json(
        { error: "productId and targetPriceInr are strictly required." },
        { status: 400 }
      );
    }

    const rule = createPurchaseRule({
      userId: body.userId || "local-buyer",
      productId: body.productId,
      productName: body.productName || "Tracked Product",
      variant: body.variant,
      industry: body.industry,
      targetPriceInr: Number(body.targetPriceInr),
      maxEffectivePayableInr: Number(body.maxEffectivePayableInr || body.targetPriceInr),
      currentObservedPriceInr: Number(body.currentObservedPriceInr || body.targetPriceInr * 1.05),
      saleEventName: body.saleEventName,
      saleStartIso: body.saleStartIso,
      saleEndIso: body.saleEndIso,
      sellerPreference: body.sellerPreference,
      purchaseMode: body.purchaseMode || "APPROVAL_REQUIRED",
    });

    return NextResponse.json({ success: true, rule }, { status: 201 });
  } catch (err: any) {
    console.error("Sale Autopilot create error:", err);
    return NextResponse.json({ error: "Failed to configure purchase rule" }, { status: 500 });
  }
}
