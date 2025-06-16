import { useQuery } from "@tanstack/react-query";

export interface Message {
  id: number;
  remetente_id: number;
  destinatario_id: number;
  conteudo: string;
  lida: boolean;
  criado_em: string;
}

export function useMessages(otherUserId: number) {
  return useQuery<Message[]>({
    queryKey: ["messages", otherUserId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/mensagens/conversa/${otherUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!otherUserId,
  });
}