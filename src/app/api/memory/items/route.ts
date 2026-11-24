import { NextResponse } from "next/server";
import {
  getOwnedItems,
  saveOwnedItem,
  updateOwnedItem,
  deleteOwnedItem,
  DEFAULT_USER_ID,
} from "@/lib/memory";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || DEFAULT_USER_ID;
    const category = url.searchParams.get("category");
    const items = getOwnedItems(userId, category as any);

    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    console.error("Owned items GET error:", err);
    return NextResponse.json({ error: err.message || "Failed to load owned items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId || DEFAULT_USER_ID;

    if (body.id && body.action === "UPDATE") {
      const updated = updateOwnedItem(body.id, body.patch, userId);
      return NextResponse.json({ success: true, item: updated });
    }

    const saved = saveOwnedItem({
      userId,
      name: body.name,
      brand: body.brand || "Unspecified",
      category: body.category || "wardrobe",
      subcategory: body.subcategory || "item",
      color: body.color,
      style: body.style,
      fit: body.fit,
      size: body.size,
      specs: body.specs,
      condition: body.condition || "EXCELLENT",
      priceInr: body.priceInr,
      notes: body.notes,
      imageUrl: body.imageUrl,
      status: body.status || "ACTIVE_IN_USE",
      source: body.source || "manual",
    });

    return NextResponse.json({ success: true, item: saved });
  } catch (err: any) {
    console.error("Owned items POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to save owned item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || DEFAULT_USER_ID;
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item id" }, { status: 400 });
    }

    const deleted = deleteOwnedItem(id, userId);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    console.error("Owned items DELETE error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete item" }, { status: 500 });
  }
}
