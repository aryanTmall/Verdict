import { NextResponse } from "next/server";
import { processVisualScan } from "@/lib/scan-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processVisualScan({
      imageBase64: body.imageBase64,
      barcode: body.barcode,
      ocrText: body.ocrText,
      mimeType: body.mimeType,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Scan API error:", err);
    return NextResponse.json({ error: "Visual scanning operation failed" }, { status: 500 });
  }
}
