import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { useConversations } from "@/hooks/use-conversations";
import { useMessages } from "@/hooks/use-messages";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useSearchParams } from "react-router-dom";
import { API_ENDPOINTS } from "@/config/api";

export default function ProfessorMessages() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: conversations, isLoading: loadingConvs } = useConversations();
  const { data: messages, isLoading: loadingMsgs } = useMessages(selectedUserId ?? 0);

  // Fetch user info when selectedUserId exists but no conversation found
  const selectedConversation = conversations?.find(conv => conv.usuario_id === selectedUserId);
  const needsUserInfo = selectedUserId && !selectedConversation;
  
  const { data: selectedUserInfo } = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.USERS.BY_ID(selectedUserId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      return response.json();
    },
    enabled: !!needsUserInfo,
  });

  // Check for userId in URL params and auto-select conversation
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam && conversations) {
      const userId = parseInt(userIdParam, 10);
      const existingConversation = conversations.find(conv => conv.usuario_id === userId);
      
      if (existingConversation) {
        setSelectedUserId(userId);
        searchParams.delete('userId');
        setSearchParams(searchParams, { replace: true });
      } else if (!selectedUserId) {
        setSelectedUserId(userId);
        searchParams.delete('userId');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [conversations, searchParams, setSearchParams, selectedUserId]);

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ destinatario_id, conteudo }: { destinatario_id: number; conteudo: string }) => {
      const res = await fetch(API_ENDPOINTS.MENSAGENS.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ destinatario_id, conteudo }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to send message:", errorData);
        throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
      }
      return res.json();
    },
    onMutate: async ({ destinatario_id, conteudo }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", selectedUserId] });
      const previousMessages = queryClient.getQueryData(["messages", selectedUserId]);
      const optimisticMsg = {
        id: `optimistic-${Date.now()}`,
        conteudo,
        criado_em: new Date().toISOString(),
        remetente_id: null,
        destinatario_id,
      };
      queryClient.setQueryData(["messages", selectedUserId], (old) => (Array.isArray(old) ? [...old, optimisticMsg] : [optimisticMsg]));
      setMessageContent("");
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages", selectedUserId], context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages", selectedUserId] });
    },
  });

  const handleSendMessage = () => {
    if (selectedUserId && messageContent.trim() !== "") {
      sendMessageMutation.mutate({
        destinatario_id: selectedUserId,
        conteudo: messageContent.trim(),
      });
    }
  };

  // Utility to group messages by date and return a flat list with separators
  function getMessagesWithDateSeparators(messages) {
    if (!messages) return [];
    const result = [];
    let lastDate = null;
    messages.forEach((msg) => {
      const msgDate = new Date(msg.criado_em);
      const dateKey = msgDate.toDateString();
      if (lastDate !== dateKey) {
        let label = format(msgDate, "dd/MM/yyyy", { locale: ptBR });
        if (isToday(msgDate)) label = "Hoje";
        else if (isYesterday(msgDate)) label = "Ontem";
        result.push({ type: "date", label, key: `date-${dateKey}` });
        lastDate = dateKey;
      }
      result.push({ type: "msg", ...msg });
    });
    return result;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfessorHeader />
      <main className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="p-4 md:col-span-1">
            <div className="mb-4">
              <Input placeholder="Buscar conversas..." className="w-full" />
            </div>
            <ScrollArea className="h-[calc(100vh-220px)]">
              {loadingConvs ? (
                <div>Carregando conversas...</div>
              ) : conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer ${selectedUserId === conversation.usuario_id ? "bg-accent" : ""}`}
                    onClick={() => setSelectedUserId(conversation.usuario_id)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar || undefined} />
                      <AvatarFallback>
                        {conversation.nome.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold truncate">{conversation.nome}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.ultima_atualizacao).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.ultima_mensagem}
                      </p>
                    </div>
                    {conversation.nao_lidas > 0 && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                ))
              ) : (
                <div>Nenhuma conversa encontrada.</div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="p-4 md:col-span-2 flex flex-col">
            {selectedUserId ? (
              <>
                <div className="flex items-center gap-4 pb-4 border-b">
                  {(() => {
                    const selected = selectedConversation || selectedUserInfo;
                    return selected ? (
                      <>
                        <Avatar>
                          <AvatarImage src={selected.avatar || undefined} />
                          <AvatarFallback>
                            {(selected.nome || selected.usuario)?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold">{selected.nome || selected.usuario}</h2>
                          {!selectedConversation && (
                            <p className="text-sm text-muted-foreground">Nova conversa</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="animate-pulse flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    );
                  })()}
                </div>
                <ScrollArea className="flex-1 h-[calc(100vh-300px)] my-4">
                  <div className="space-y-4">
                    {loadingMsgs ? (
                      <div>Carregando mensagens...</div>
                    ) : messages && messages.length > 0 ? (
                      getMessagesWithDateSeparators(messages).map((item) => {
                        if (item.type === "date") {
                          return (
                            <div key={item.key} className="flex justify-center my-2">
                              <span className="bg-muted text-xs px-3 py-1 rounded-full text-muted-foreground font-medium">
                                {item.label}
                              </span>
                            </div>
                          );
                        } else {
                          const msg = item;
                          return (
                            <div
                              key={msg.id}
                              className={`flex gap-2 items-start ${msg.remetente_id === (conversations.find(c => c.usuario_id === selectedUserId)?.usuario_id) ? "" : "justify-end"}`}
                            >
                              {msg.remetente_id === (conversations.find(c => c.usuario_id === selectedUserId)?.usuario_id) ? (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={conversations.find(c => c.usuario_id === selectedUserId)?.avatar || undefined} />
                                  <AvatarFallback>{conversations.find(c => c.usuario_id === selectedUserId)?.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                              ) : null}
                              <div className={`rounded-lg p-3 max-w-[80%] ${msg.remetente_id === (conversations.find(c => c.usuario_id === selectedUserId)?.usuario_id) ? "bg-accent" : "bg-primary text-primary-foreground"}`}>
                                <p>{msg.conteudo}</p>
                                <span className={`text-xs mt-1 block ${msg.remetente_id === (conversations.find(c => c.usuario_id === selectedUserId)?.usuario_id) ? "text-muted-foreground" : "text-primary-foreground"}`}>
                                  {new Date(msg.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      })
                    ) : (messages && messages.length === 0 && selectedUserId !== null) ? (
                      <div>Nenhuma mensagem nesta conversa.</div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    disabled={sendMessageMutation.isPending || !selectedUserId}
                  />
                  <Button onClick={handleSendMessage} disabled={sendMessageMutation.isPending || !selectedUserId || messageContent.trim() === ""}>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Selecione uma conversa para ver as mensagens.
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
