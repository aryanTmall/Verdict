import { NextResponse } from "next/server";
import { createEvent, type DateArray } from "ics";
import { getVerdictFromStorage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return new NextResponse("Missing slug parameter", { status: 400 });
    }

    const verdict = await getVerdictFromStorage(slug);
    if (!verdict) {
      return new NextResponse("Verdict not found", { status: 404 });
    }

    // Determine target reminder date:
    // 10 months from purchase date or before earliest observed failure
    const now = new Date();
    const reminderDate = new Date(now.getTime() + 10 * 30 * 24 * 60 * 60 * 1000);
    const start: DateArray = [
      reminderDate.getFullYear(),
      reminderDate.getMonth() + 1,
      reminderDate.getDate(),
      10,
      0,
    ];

    const eventResult = createEvent({
      start,
      duration: { hours: 1 },
      title: `VERDICT: Inspect ${verdict.productName} before warranty cutoff`,
      description: `Cross-examination check for ${verdict.productName}.\nPrimary observed risk to inspect: ${verdict.topRiskTitle}.\nCheck hinge, thermals, and battery health before the 1-year warranty expires.\nVerdict link: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/${slug}`,
      location: "Home / Service Center",
      status: "CONFIRMED",
      busyStatus: "BUSY",
    });

    if (eventResult.error || !eventResult.value) {
      throw eventResult.error || new Error("Failed to generate ics event");
    }

    return new NextResponse(eventResult.value, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="verdict-warranty-reminder-${slug}.ics"`,
      },
    });
  } catch (err: any) {
    console.error("ICS generation error:", err);
    return new NextResponse("Failed to generate calendar reminder", { status: 500 });
  }
}
