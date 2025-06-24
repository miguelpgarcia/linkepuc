import { useMemo } from "react";
import { useGlobalData } from "./use-global-data";

interface OpportunityType {
  id: number;
  nome: string;
}

interface Department {
  id: number;
  name: string;
}

interface FormData {
  opportunityTypes: { value: string; label: string; id: number }[];
  departments: { value: string; label: string; id: number }[];
}

export function useOpportunityFormData() {
  // Use centralized data instead of making separate API calls
  const { types, departments, isLoading } = useGlobalData();

  // Transform the data to the format expected by form components
  const opportunityTypes = useMemo(() => {
    return types.map((item: OpportunityType) => ({
      value: item.nome.toLowerCase().replace(/\s+/g, "_"),
      label: item.nome,
      id: item.id,
    }));
  }, [types]);

  const mappedDepartments = useMemo(() => {
    return departments.map((item: Department) => ({
      value: item.name.toLowerCase().replace(/\s+/g, "_"),
      label: item.name,
      id: item.id,
    }));
  }, [departments]);

  return {
    opportunityTypes,
    departments: mappedDepartments,
    isLoading,
  };
} 