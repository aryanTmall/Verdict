import { NextResponse } from "next/server";
import { getNotifications, markNotificationAsRead, addNotification } from "@/lib/notifications";

export async function GET() {
  const notifications = getNotifications();
  return NextResponse.json({ notifications });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === "mark_read" && body.id) {
      const success = markNotificationAsRead(body.id);
      return NextResponse.json({ success });
    }

    if (body.title && body.message) {
      const created = addNotification({
        title: body.title,
        message: body.message,
        type: body.type || "PRICE_DROP",
        severity: body.severity || "normal",
        actionUrl: body.actionUrl,
        actionLabel: body.actionLabel,
      });
      return NextResponse.json({ success: true, notification: created }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: "Notification API failure" }, { status: 500 });
  }
}
