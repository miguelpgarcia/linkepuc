import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";

interface OpportunityType {
  id: number;
  nome: string;
}

interface Department {
  id: number;
  name: string;
  sigla: string;
}

interface Interest {
  id: number;
  nome: string;
}

/**
 * Hook for static data that NEVER changes - loaded before login
 * This is PUBLIC data that doesn't require authentication
 */
export function useStaticData() {
  // Fetch opportunity types - PUBLIC, NEVER CHANGES
  const { data: types = [], isLoading: isLoadingTypes } = useQuery<OpportunityType[]>({
    queryKey: ["static-opportunity-types"],
    queryFn: async () => {
      console.log("🚀 Loading static tipos (pre-login)");
      const response = await fetch("http://localhost:8000/vagas/tipo"); // Use fetch, not apiFetch (no auth needed)
      return response.json();
    },
    staleTime: Infinity, // NEVER refetch - data never changes
    gcTime: Infinity, // Keep in cache forever
  });

  // Fetch departments - PUBLIC, RARELY CHANGES
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery<Department[]>({
    queryKey: ["static-departments"],
    queryFn: async () => {
      console.log("🚀 Loading static departamentos (pre-login)");
      const response = await fetch("http://localhost:8000/departamentos/");
      return response.json();
    },
    staleTime: Infinity, // NEVER refetch - data rarely changes
    gcTime: Infinity, // Keep in cache forever
  });

  // Fetch interests - PUBLIC, RARELY CHANGES
  const { data: interests = [], isLoading: isLoadingInterests } = useQuery<Interest[]>({
    queryKey: ["static-interests"],
    queryFn: async () => {
      console.log("🚀 Loading static interesses (pre-login)");
      const response = await fetch("http://localhost:8000/interesses/");
      return response.json();
    },
    staleTime: Infinity, // NEVER refetch - data rarely changes
    gcTime: Infinity, // Keep in cache forever
  });

  return {
    types,
    departments,
    interests,
    isLoading: isLoadingTypes || isLoadingDepartments || isLoadingInterests,
    isReady: types.length > 0 && departments.length > 0 && interests.length > 0,
  };
} 