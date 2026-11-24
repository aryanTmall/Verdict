import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { identifyProductFromImage } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json();
    const catalog = getCatalog();
    const catalogNames = catalog.map((p) => ({ slug: p.slug, name: p.name }));

    const res = await identifyProductFromImage(imageBase64, mimeType || "image/jpeg", catalogNames);
    return NextResponse.json(res);
  } catch (err: any) {
    console.error("Identify API error:", err);
    return NextResponse.json({
      matchSlug: null,
      confidence: 0,
      message: "Could not identify product in catalog",
    });
  }
}
