
import { Bell, Calendar, Link, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { NotificationCard } from "@/components/notification/NotificationCard";
import { Notification, NotificationType } from "@/types/notification";

// Mock data for notifications
const notifications: Notification[] = [
  {
    id: 1,
    type: "opportunity",
    title: "Monitoria em Estruturas de Dados",
    description: "Você teve 9.0 em Estruturas de Dados e uma vaga de monitoria acaba de abrir. Quer se inscrever?",
    time: "há 1 hora",
    icon: "calendar",
    unread: true,
    action: {
      label: "Me inscrever",
      href: "/opportunities/monitor/1"
    }
  },
  {
    id: 2,
    type: "connection",
    title: "Nova conexão",
    description: "Prof. Carlos aceitou sua solicitação de conexão",
    time: "há 2 horas",
    icon: "user",
    unread: true
  },
  {
    id: 3,
    type: "engagement",
    title: "Nível 2 Alcançado! 🎉",
    description: "Com a atualização do seu currículo, você ganhou +100 pontos",
    time: "há 1 dia",
    icon: "award",
    unread: false
  }
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Notificações</h1>
            <Button variant="outline">Marcar todas como lidas</Button>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <RadioGroup defaultValue="all" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <label htmlFor="all">Todas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opportunities" id="opportunities" />
                  <label htmlFor="opportunities">Oportunidades</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="connections" id="connections" />
                  <label htmlFor="connections">Conexões</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="engagement" id="engagement" />
                  <label htmlFor="engagement">Engajamento</label>
                </div>
              </RadioGroup>

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
