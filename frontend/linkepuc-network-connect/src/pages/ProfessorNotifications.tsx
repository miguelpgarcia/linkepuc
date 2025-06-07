
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { NotificationCard } from "@/components/notification/NotificationCard";
import { Notification, NotificationType } from "@/types/notification";

// Mock data for professor notifications
const notifications: Notification[] = [
  {
    id: 1,
    type: "opportunity",
    title: "Novo candidato: Monitoria em Algoritmos",
    description: "Pedro Almeida se inscreveu para sua vaga de monitoria",
    time: "há 30 minutos",
    icon: "user",
    unread: true,
    action: {
      label: "Ver candidatura",
      href: "/professor/opportunities/1"
    }
  },
  {
    id: 2,
    type: "engagement",
    title: "Alta visualização",
    description: "Sua vaga de Iniciação Científica foi vista por 45 alunos nas últimas 24h",
    time: "há 2 horas",
    icon: "eye",
    unread: true
  },
  {
    id: 3,
    type: "opportunity",
    title: "Novo candidato qualificado",
    description: "Maria Silva, com nota 9.5 em Cálculo III, se candidatou à sua vaga",
    time: "há 1 dia",
    icon: "user",
    unread: false,
    action: {
      label: "Avaliar perfil",
      href: "/professor/opportunities/2"
    }
  },
  {
    id: 4,
    type: "connection",
    title: "Nova mensagem",
    description: "Prof. Roberto enviou uma mensagem sobre colaboração em pesquisa",
    time: "há 2 dias",
    icon: "mail",
    unread: false,
    action: {
      label: "Ver mensagem",
      href: "/professor/messages"
    }
  }
];

export default function ProfessorNotifications() {
  return (
    <div className="min-h-screen bg-background">
      <ProfessorHeader />
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
                  <RadioGroupItem value="candidates" id="candidates" />
                  <label htmlFor="candidates">Candidaturas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="messages" id="messages" />
                  <label htmlFor="messages">Mensagens</label>
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
}
