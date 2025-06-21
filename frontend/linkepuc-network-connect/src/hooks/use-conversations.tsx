import { useQuery } from "@tanstack/react-query";

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
      const res = await fetch("http://localhost:8000/mensagens/conversas", {
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