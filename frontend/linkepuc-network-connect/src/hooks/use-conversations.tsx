import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/api";

export interface Conversation {
  id: number;
  usuario_id: number;
  nome: string;
  avatar: string | null;
  ultima_mensagem: string;
  nao_lidas: number;
  ultima_atualizacao: string;
}

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.MENSAGENS.CONVERSAS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 