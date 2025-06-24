import { useGlobalData } from "./use-global-data";

// Re-export the interfaces for compatibility
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
  // Use centralized data instead of making separate API calls
  const { types, departments, interests } = useGlobalData();

  return {
    types,
    departments,
    interests,
  };
} 