import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { saveVerdictToStorage, listSavedVerdicts } from "@/lib/storage";
import type { SavedVerdict } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Omit<SavedVerdict, "id" | "slug" | "createdAt">;
    const slug = `vdt-${crypto.randomBytes(4).toString("hex")}`;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const record: SavedVerdict = {
      ...payload,
      id,
      slug,
      createdAt,
    };

    const saved = await saveVerdictToStorage(record);
    return NextResponse.json({ success: true, slug: saved.slug, id });
  } catch (err: any) {
    console.error("Save verdict error:", err);
    return NextResponse.json({ error: err.message || "Failed to save verdict" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await listSavedVerdicts();
    return NextResponse.json(list);
  } catch (err: any) {
    console.error("List verdicts error:", err);
    return NextResponse.json({ error: err.message || "Failed to list verdicts" }, { status: 500 });
  }
}
