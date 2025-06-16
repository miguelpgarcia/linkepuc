import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";

export interface ProfessorOpportunity {
  id: number;
  titulo: string;
  descricao: string;
  prazo: string;
  tipo: {
    id: number;
    nome: string;
  };
  remuneracao: number | null;
  horas_complementares: number | null;
  desconto: number | null;
  criado_em: string;
  autor: {
    id: number;
    usuario: string;
    avatar?: string;
  };
  department: {
    id: number;
    name: string;
  } | null;
  link_vaga: string | null;
  professor: string | null;
  status: "aguardando" | "em_analise" | "finalizada" | "encerrada" | "em_andamento";
  candidates: number;
}

// Fetch opportunities from the API
const fetchOpportunities = async (): Promise<ProfessorOpportunity[]> => {
  try {
    const response = await apiFetch("http://localhost:8000/vagas/professor");
    if (!response.ok) {
      throw new Error("Failed to fetch opportunities");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message === "No authentication token found") {
      window.location.href = "/login";
    }
    throw error;
  }
};

// Fetch a single opportunity
const fetchOpportunity = async (id: string): Promise<ProfessorOpportunity> => {
  try {
    const response = await apiFetch(`http://localhost:8000/vagas/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch opportunity");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message === "No authentication token found") {
      window.location.href = "/login";
    }
    throw error;
  }
};

export function useProfessorOpportunities() {
  const queryClient = useQueryClient();

  // Query for all opportunities
  const { data: opportunities, isLoading, error } = useQuery<ProfessorOpportunity[]>({
    queryKey: ["professor-opportunities"],
    queryFn: fetchOpportunities,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Mutation for creating a new opportunity
  const createOpportunity = useMutation({
    mutationFn: async (newOpportunity: Omit<ProfessorOpportunity, "id">) => {
      try {
        const response = await apiFetch("http://localhost:8000/vagas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOpportunity),
        });
        if (!response.ok) {
          throw new Error("Failed to create opportunity");
        }
        return response.json();
      } catch (error) {
        if (error instanceof Error && error.message === "No authentication token found") {
          window.location.href = "/login";
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professor-opportunities"] });
    },
  });

  // Mutation for updating an opportunity
  const updateOpportunity = useMutation({
    mutationFn: async ({ id, ...data }: ProfessorOpportunity) => {
      try {
        const response = await apiFetch(`http://localhost:8000/vagas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Failed to update opportunity");
        }
        return response.json();
      } catch (error) {
        if (error instanceof Error && error.message === "No authentication token found") {
          window.location.href = "/login";
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professor-opportunities"] });
    },
  });

  // Mutation for deleting an opportunity
  const deleteOpportunity = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://localhost:8000/vagas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete opportunity");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch opportunities after deleting
      queryClient.invalidateQueries({ queryKey: ["professor-opportunities"] });
    },
  });

  return {
    opportunities,
    isLoading,
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  };
}

export function useProfessorOpportunity(id: string) {
  const queryClient = useQueryClient();

  // Query for a single opportunity
  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ["professorOpportunity", id],
    queryFn: () => fetchOpportunity(id),
    // Keep the data in cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  return {
    opportunity,
    isLoading,
    error,
  };
} 