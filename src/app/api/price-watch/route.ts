import { NextResponse } from "next/server";
import { getPurchaseRules, createPurchaseRule, deletePurchaseRule } from "@/lib/sale-autopilot";

export async function GET() {
  const alerts = getPurchaseRules().filter((r) => r.purchaseMode === "NOTIFY_ONLY");
  return NextResponse.json({ alerts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rule = createPurchaseRule({
      productId: body.productId || "tracked-specimen",
      productName: body.productName || "Tracked Specimen",
      targetPriceInr: Number(body.targetPriceInr || 50000),
      maxEffectivePayableInr: Number(body.targetPriceInr || 50000),
      currentObservedPriceInr: Number(body.currentPriceInr || 55000),
      purchaseMode: "NOTIFY_ONLY",
    });

    return NextResponse.json({ success: true, alert: rule }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to configure price alert" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const deleted = deletePurchaseRule(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
