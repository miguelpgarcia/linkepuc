
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

// Mock data for professor conversations
const conversations = [
  {
    id: 1,
    name: "Maria Silva",
    lastMessage: "Professor, gostaria de tirar uma dúvida sobre a vaga de monitoria",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    unread: true,
    timestamp: "14:30",
  },
  {
    id: 2,
    name: "Pedro Gomes",
    lastMessage: "Obrigado pela oportunidade de pesquisa!",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    unread: false,
    timestamp: "Ontem",
  },
  {
    id: 3,
    name: "Laura Mendes",
    lastMessage: "Enviei meu currículo para a vaga de iniciação científica",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    unread: true,
    timestamp: "Segunda",
  },
];

export default function ProfessorMessages() {
  return (
    <div className="min-h-screen bg-background">
      <ProfessorHeader />
      <main className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="p-4 md:col-span-1">
            <div className="mb-4">
              <Input 
                placeholder="Buscar conversas..." 
                className="w-full"
              />
            </div>
            <ScrollArea className="h-[calc(100vh-220px)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="p-4 md:col-span-2 flex flex-col">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar>
                <AvatarImage src={conversations[0].avatar} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{conversations[0].name}</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>

            <ScrollArea className="flex-1 h-[calc(100vh-300px)] my-4">
              <div className="space-y-4">
                <div className="flex gap-2 items-start">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={conversations[0].avatar} />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="bg-accent rounded-lg p-3 max-w-[80%]">
                    <p>Professor, gostaria de tirar uma dúvida sobre a vaga de monitoria. Quais são os horários necessários?</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      14:30
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-start justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                    <p>Olá Maria! Os horários são flexíveis, mas precisamos de pelo menos 10h semanais, distribuídas entre segunda e quarta.</p>
                    <span className="text-xs text-primary-foreground/80 mt-1 block">
                      14:45
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t">
              <Input 
                placeholder="Digite sua mensagem..." 
                className="flex-1"
              />
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
