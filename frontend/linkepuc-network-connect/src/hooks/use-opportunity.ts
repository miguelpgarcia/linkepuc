import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

export interface Opportunity {
  id: number;
  titulo: string;
  descricao: string;
  prazo: string;
  tipo: {
    id: number;
    nome: string;
  };
  department: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  autor: {
    id: number;
    usuario: string;
    avatar?: string;
  };
  remuneracao?: number;
  horas_complementares?: number;
  desconto?: number;
  professor?: string;
  link_vaga?: string;
  interesses: Array<{
    interesse: {
      id: number;
      nome: string;
    };
  }>;
}

export const useOpportunity = (id: string) => {
  const { data: opportunity, isLoading, error } = useQuery<Opportunity>({
    queryKey: ["opportunity", id],
    queryFn: async () => {
      const response = await apiFetch(API_ENDPOINTS.VAGAS.BY_ID(id));
      if (!response.ok) {
        throw new Error("Failed to fetch opportunity");
      }
      return response.json();
    },
    enabled: !!id,
  });

  return {
    opportunity,
    isLoading,
    error,
  };
};
