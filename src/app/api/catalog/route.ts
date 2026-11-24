import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = getCatalog();
    return NextResponse.json(catalog);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
