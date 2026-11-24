import { NextResponse } from "next/server";
import { approvePurchaseRule } from "@/lib/sale-autopilot";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = approvePurchaseRule(id, {
      userSignature: body.userSignature || "VERIFIED_BUYER_CONSENT",
      idempotencyToken: body.idempotencyToken,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Sale Autopilot approval error:", err);
    return NextResponse.json({ error: "Failed to process purchase authorization" }, { status: 500 });
  }
}
