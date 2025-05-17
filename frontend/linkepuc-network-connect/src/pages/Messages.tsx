
import { Mail } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/layout/Header";

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Ana Silva",
    lastMessage: "Oi! Vi que você também está cursando Eng. de Software",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    unread: true,
    timestamp: "14:30",
  },
  {
    id: 2,
    name: "Prof. Carlos",
    lastMessage: "Sobre o projeto final...",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    unread: false,
    timestamp: "Ontem",
  },
  {
    id: 3,
    name: "João Monitor",
    lastMessage: "Pessoal, amanhã teremos monitoria extra às 14h",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    unread: true,
    timestamp: "Segunda",
  },
];

const Messages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
                <AvatarFallback>AS</AvatarFallback>
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
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="bg-accent rounded-lg p-3 max-w-[80%]">
                    <p>{conversations[0].lastMessage}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      14:30
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-start justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                    <p>Oi Ana! Sim, estou no 4º período. Você?</p>
                    <span className="text-xs text-primary-foreground/80 mt-1 block">
                      14:31
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
};

export default Messages;
