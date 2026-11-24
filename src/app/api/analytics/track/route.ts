import { NextResponse } from "next/server";

/**
 * Privacy-first analytics ingestion endpoint
 */
export async function POST(req: Request) {
  try {
    const event = await req.json();
    if (!event || !event.eventType) {
      return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    }

    // In production, write to internal logging or database.
    // Zero PII logged.
    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
