import { useQuery } from "@tanstack/react-query";

export interface Message {
  id: number;
  conteudo: string;
  criado_em: string;
  remetente_id: number;
  destinatario_id: number;
}

export function useMessages(userId: number) {
  return useQuery<Message[]>({
    queryKey: ["messages", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const res = await fetch(`http://localhost:8000/mensagens/conversa/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 