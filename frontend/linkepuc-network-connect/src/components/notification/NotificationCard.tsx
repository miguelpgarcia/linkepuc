
import { Bell, Calendar, Link, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/notification";

type NotificationCardProps = {
  notification: Notification;
};

const iconMap = {
  calendar: Calendar,
  user: User,
  link: Link,
  award: Award,
};

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const IconComponent = iconMap[notification.icon as keyof typeof iconMap] || Bell;

  return (
    <div className={`p-4 rounded-lg border ${notification.unread ? 'bg-accent' : 'bg-background'}`}>
      <div className="flex gap-4">
        <div className="mt-1">
          <IconComponent className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{notification.title}</h3>
            <span className="text-sm text-muted-foreground">{notification.time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{notification.description}</p>
          {notification.action && (
            <div className="mt-2">
              <Button variant="secondary" size="sm" asChild>
                <a href={notification.action.href}>{notification.action.label}</a>
              </Button>
            </div>
          )}
        </div>
        {notification.unread && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
        )}
      </div>
    </div>
  );
};
