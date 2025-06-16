import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";

interface OpportunityType {
  id: number;
  nome: string;
}

interface Department {
  id: number;
  name: string;
}

interface Interest {
  id: number;
  nome: string;
}

export function useOpportunityFilters() {
  // Fetch opportunity types
  const { data: types = [] } = useQuery<OpportunityType[]>({
    queryKey: ["opportunity-types"],
    queryFn: async () => {
      const response = await apiFetch("http://localhost:8000/vagas/tipo");
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // Data stays fresh for 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // Cache is kept for 24 hours
  });

  // Fetch departments
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await apiFetch("http://localhost:8000/departamentos");
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  // Fetch interests
  const { data: interests = [] } = useQuery<Interest[]>({
    queryKey: ["interests"],
    queryFn: async () => {
      const response = await apiFetch("http://localhost:8000/interesses");
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    types,
    departments,
    interests,
  };
} 