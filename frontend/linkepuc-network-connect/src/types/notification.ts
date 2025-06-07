
export type NotificationType = "opportunity" | "connection" | "engagement";

export interface NotificationAction {
  label: string;
  href: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  icon: string;
  unread: boolean;
  action?: NotificationAction;
}
