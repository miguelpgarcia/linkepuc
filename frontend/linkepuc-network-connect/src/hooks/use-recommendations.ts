import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/apiFetch';
import { toast } from 'sonner';
import { useMemo } from 'react';

export interface RecommendationStrategy {
  name: string;
  description: string;
  score: number;
  explanation: string;
}

export interface Recommendation {
  vaga_id: number;
  vaga: {
    id: number;
    titulo: string;
    descricao: string;
    prazo?: string;
    status: string;
  };
  total_score: number;
  strategies: RecommendationStrategy[];
  updated_at?: string;
}

export interface RecommendationExplanation {
  vaga_id: number;
  user_id: number;
  total_score: number;
  strategies: RecommendationStrategy[];
}

interface UseRecommendationsOptions {
  limit?: number;
  searchQuery?: string;
  selectedTypes?: number[];
  selectedDepartment?: string;
  selectedBenefits?: string[];
}

export const useRecommendations = (options: UseRecommendationsOptions = {}) => {
  const { 
    limit = 10,
    searchQuery = "",
    selectedTypes = [],
    selectedDepartment = "Todos os Departamentos",
    selectedBenefits = []
  } = options;
  
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading, error } = useQuery<Recommendation[]>({
    queryKey: ["recommendations", limit],
    queryFn: async () => {
      const response = await apiFetch(`http://localhost:8000/recomendacoes/?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      return response.json();
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
  });

  // Apply filters to recommendations (similar to opportunities)
  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];

    console.log('Raw recommendations:', recommendations);
    console.log('Recommendations count:', recommendations.length);
    
    // Check for duplicates
    const vagaIds = recommendations.map(r => r.vaga_id);
    const uniqueVagaIds = [...new Set(vagaIds)];
    console.log('Vaga IDs:', vagaIds);
    console.log('Unique Vaga IDs:', uniqueVagaIds);
    
    if (vagaIds.length !== uniqueVagaIds.length) {
      console.warn('Duplicate recommendations detected!');
    }

    // Remove duplicates by vaga_id, keeping the one with highest score
    const uniqueRecommendations = recommendations.reduce((acc, current) => {
      const existing = acc.find(item => item.vaga_id === current.vaga_id);
      if (!existing) {
        acc.push(current);
      } else if (current.total_score > existing.total_score) {
        // Replace with higher score
        const index = acc.findIndex(item => item.vaga_id === current.vaga_id);
        acc[index] = current;
      }
      return acc;
    }, [] as Recommendation[]);

    console.log('After deduplication:', uniqueRecommendations);

    const filtered = uniqueRecommendations.filter((rec) => {
      // Search filter
      const matchesSearch = 
        searchQuery === "" ||
        rec.vaga.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.vaga.descricao.toLowerCase().includes(searchQuery.toLowerCase());

      // For now, we don't have type/department data in recommendations
      // But we can add this later when the backend provides more vaga details
      
      return matchesSearch;
    });
    
    console.log('Filtered recommendations:', filtered);
    return filtered;
  }, [recommendations, searchQuery, selectedTypes, selectedDepartment, selectedBenefits]);

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiFetch("http://localhost:8000/recomendacoes/refresh", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to refresh recommendations");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch recommendations
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Recomendações atualizadas com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar recomendações");
      console.error("Error refreshing recommendations:", error);
    },
  });

  const refreshRecommendations = () => {
    refreshMutation.mutate();
  };

  return {
    recommendations: filteredRecommendations,
    isLoading,
    error,
    refreshRecommendations,
    isRefreshing: refreshMutation.isPending,
  };
};

export const useRecommendationExplanation = (vagaId: number) => {
  const { data: explanation, isLoading, error } = useQuery<RecommendationExplanation>({
    queryKey: ["recommendationExplanation", vagaId],
    queryFn: async () => {
      const response = await apiFetch(`http://localhost:8000/recomendacoes/explanation/${vagaId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendation explanation");
      }
      return response.json();
    },
    enabled: !!vagaId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    explanation,
    isLoading,
    error,
  };
};

export function useRecommendationStats() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['recommendation-stats'],
    queryFn: async () => {
      const response = await apiFetch('http://localhost:8000/recomendacoes/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendation stats');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBulkRecommendationCalculation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiFetch('http://localhost:8000/recomendacoes/calculate-all', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to start bulk calculation');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cálculo iniciado",
        description: "O cálculo de recomendações para todos os usuários foi iniciado.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao iniciar cálculo",
        description: "Não foi possível iniciar o cálculo de recomendações.",
        variant: "destructive",
      });
    },
  });
} 