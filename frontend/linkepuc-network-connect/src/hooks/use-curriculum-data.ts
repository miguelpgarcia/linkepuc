import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

interface HistoricoEntry {
  id: number;
  user_id: number;
  periodo: string;
  codigo_disciplina: string;
  nome_disciplina: string;
  turma: string;
  grau: number | null;
  situacao: string;
  n_creditos: number;
}

export function useCurriculumData() {
  return useQuery({
    queryKey: ['curriculum-data'],
    queryFn: async () => {
      const response = await apiFetch(API_ENDPOINTS.HISTORICOS.BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch curriculum data');
      }
      const data: HistoricoEntry[] = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook para calcular horas complementares baseadas no histórico
export function useComplementaryHours() {
  const { data: curriculumData, isLoading, error } = useCurriculumData();

  const complementaryHours = useMemo(() => {
    if (!curriculumData || curriculumData.length === 0) {
      return {
        hasHistory: false,
        completed: null,
        totalRequired: 10, // Total de 10 créditos
      };
    }

    // Procurar por ACP0900 (Atividades Complementares)
    const acpEntry = curriculumData.find(entry => 
      entry.codigo_disciplina === 'ACP0900'
    );

    if (!acpEntry) {
      return {
        hasHistory: true,
        completed: null, // Não encontrou atividades complementares
        totalRequired: 10,
      };
    }

    return {
      hasHistory: true,
      completed: acpEntry.n_creditos || 0, // Créditos já obtidos
      totalRequired: 10, // Total sempre 10 créditos
    };
  }, [curriculumData]);

  return {
    ...complementaryHours,
    isLoading,
    error,
  };
} 