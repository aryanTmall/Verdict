export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "PRICE_DROP" | "SALE_COUNTDOWN" | "AUTOPILOT_TRIGGER" | "STOCK_ALERT" | "WARRANTY_REMINDER";
  timestamp: string;
  isRead: boolean;
  severity: "high" | "normal" | "low";
  actionUrl?: string;
  actionLabel?: string;
}

let notificationsStore: AppNotification[] = [
  {
    id: "notif-1",
    title: "Sale Autopilot Condition Met: Creta SX(O)",
    message: "Dealership incentive of ₹25,000 dropped effective price to ₹18,45,000. Your approval is required to prepare secure booking.",
    type: "AUTOPILOT_TRIGGER",
    timestamp: "10 mins ago",
    isRead: false,
    severity: "high",
    actionUrl: "#autopilot",
    actionLabel: "Review Approval",
  },
  {
    id: "notif-2",
    title: "Price Radar Alert: Acer Swift Go 14 OLED",
    message: "Amazon price matched Croma at ₹69,990 (All-time low territory).",
    type: "PRICE_DROP",
    timestamp: "1 hour ago",
    isRead: false,
    severity: "normal",
    actionUrl: "https://www.amazon.in/s?k=acer+swift+go+14+oled",
    actionLabel: "View Listing",
  },
  {
    id: "notif-3",
    title: "Festive Countdown: Year-End Clearance Sale",
    message: "Annual automotive clearance discount window begins in 14 days. Dealerships clearing current calendar year VIN inventory.",
    type: "SALE_COUNTDOWN",
    timestamp: "1 day ago",
    isRead: true,
    severity: "low",
  },
];

export function getNotifications(): AppNotification[] {
  return [...notificationsStore];
}

export function markNotificationAsRead(id: string): boolean {
  const notif = notificationsStore.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    return true;
  }
  return false;
}

export function addNotification(params: Omit<AppNotification, "id" | "timestamp" | "isRead">): AppNotification {
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    ...params,
    timestamp: "Just now",
    isRead: false,
  };
  notificationsStore.unshift(newNotif);
  return newNotif;
}
