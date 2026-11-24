import { NextResponse } from "next/server";
import {
  loadUserProfile,
  saveMemory,
  updateMemory,
  deleteMemory,
  clearCategory,
  clearAllMemories,
  updateMemorySettings,
  DEFAULT_USER_ID,
  resetToSeedDefaults,
} from "@/lib/memory";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || DEFAULT_USER_ID;
    const profile = loadUserProfile(userId);

    return NextResponse.json({
      success: true,
      profile,
      settings: profile.settings,
      memories: profile.memories,
      ownedItems: profile.ownedItems,
      decisions: profile.decisions,
    });
  } catch (err: any) {
    console.error("Memory GET error:", err);
    return NextResponse.json({ error: err.message || "Failed to load memory" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId || DEFAULT_USER_ID;

    // Action 1: Update Settings
    if (body.action === "UPDATE_SETTINGS" && body.settings) {
      const updated = updateMemorySettings(body.settings, userId);
      return NextResponse.json({ success: true, settings: updated });
    }

    // Action 2: Reset to Defaults
    if (body.action === "RESET_DEFAULTS") {
      const profile = resetToSeedDefaults(userId);
      return NextResponse.json({ success: true, profile });
    }

    // Action 3: Save / Update Memory
    if (body.id && body.action === "UPDATE") {
      const updated = updateMemory(body.id, body.patch, userId);
      return NextResponse.json({ success: true, memory: updated });
    }

    const saved = saveMemory({
      userId,
      category: body.category || "style",
      type: body.type || "explicit",
      key: body.key,
      value: body.value,
      source: body.source || "manual",
      confidence: body.confidence ?? 1.0,
      importance: body.importance ?? 4,
      status: body.status || "active",
      userConfirmationStatus: body.userConfirmationStatus || "confirmed",
      evidenceQuote: body.evidenceQuote,
    });

    return NextResponse.json({ success: true, memory: saved });
  } catch (err: any) {
    console.error("Memory POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to save memory" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || DEFAULT_USER_ID;
    const memoryId = url.searchParams.get("id");
    const category = url.searchParams.get("category");
    const all = url.searchParams.get("all") === "true";

    if (all) {
      clearAllMemories(userId);
      return NextResponse.json({ success: true, message: "All memory purged." });
    }

    if (category) {
      clearCategory(category as any, userId);
      return NextResponse.json({ success: true, message: `Category ${category} cleared.` });
    }

    if (memoryId) {
      const deleted = deleteMemory(memoryId, userId);
      return NextResponse.json({ success: deleted });
    }

    return NextResponse.json({ error: "Missing memory id, category or all flag" }, { status: 400 });
  } catch (err: any) {
    console.error("Memory DELETE error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete memory" }, { status: 500 });
  }
}
