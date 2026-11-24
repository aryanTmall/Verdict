import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    product: "VERDICT",
    tagline: "See beyond the buy",
    timestamp: new Date().toISOString(),
  });
}
