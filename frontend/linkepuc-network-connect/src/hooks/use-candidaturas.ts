import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { useToast } from "@/hooks/use-toast";

interface CandidaturaCreate {
  carta_motivacao?: string;
}

interface CandidaturaStatus {
  has_applied: boolean;
}

interface CandidatoInfo {
  id: number;
  usuario: string;
  email: string;
  avatar?: string;
}

interface CandidaturaDetalhada {
  id: number;
  candidato: CandidatoInfo;
  carta_motivacao?: string;
  criado_em: string;
}

export function useCandidaturaStatus(vagaId: number) {
  return useQuery<CandidaturaStatus>({
    queryKey: ['candidatura-status', vagaId],
    queryFn: async () => {
      const response = await apiFetch(`http://localhost:8000/api/candidaturas/vaga/${vagaId}/candidatura-status`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidatura status');
      }
      return response.json();
    },
    enabled: !!vagaId,
  });
}

export function useCandidatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ vagaId, carta_motivacao }: { vagaId: number; carta_motivacao?: string }) => {
      const response = await apiFetch(`http://localhost:8000/api/candidaturas/vaga/${vagaId}/candidatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carta_motivacao }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply for opportunity');
      }
      
      return response.json();
    },
    onSuccess: (_, { vagaId }) => {
      queryClient.invalidateQueries({ queryKey: ['candidatura-status', vagaId] });
      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi enviada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao candidatar",
        description: "Não foi possível enviar sua candidatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useCancelarCandidatura() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vagaId: number) => {
      const response = await apiFetch(`http://localhost:8000/api/candidaturas/vaga/${vagaId}/candidatar`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel application');
      }
      
      return response.json();
    },
    onSuccess: (_, vagaId) => {
      queryClient.invalidateQueries({ queryKey: ['candidatura-status', vagaId] });
      toast({
        title: "Candidatura cancelada",
        description: "Sua candidatura foi cancelada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar sua candidatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useCandidatos(vagaId: number) {
  return useQuery<CandidaturaDetalhada[]>({
    queryKey: ['candidatos', vagaId],
    queryFn: async () => {
      const response = await apiFetch(`http://localhost:8000/api/candidaturas/vaga/${vagaId}/candidatos`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      return response.json();
    },
    enabled: !!vagaId,
  });
} 