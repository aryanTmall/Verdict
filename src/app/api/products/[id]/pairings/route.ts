import { NextResponse } from "next/server";
import { getSmartPairings } from "@/lib/smart-pairing";
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

    const pairings = getSmartPairings(product);
    return NextResponse.json(pairings);
  } catch (err: any) {
    console.error("Smart pairings error:", err);
    return NextResponse.json({ error: "Failed to load smart pairings" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const product = body.product || {
      slug: id,
      name: body.productName || id.replace(/-/g, " "),
      priceInr: body.priceInr || 75000,
      industry: body.industry,
    };

    const pairings = getSmartPairings(product);
    return NextResponse.json(pairings);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to evaluate pairings" }, { status: 500 });
  }
}
