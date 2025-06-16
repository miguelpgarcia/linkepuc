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

interface FormData {
  opportunityTypes: { value: string; label: string; id: number }[];
  departments: { value: string; label: string; id: number }[];
}

async function fetchOpportunityTypes(): Promise<{ value: string; label: string; id: number }[]> {
  const response = await apiFetch("http://localhost:8000/vagas/tipo");
  if (!response.ok) {
    throw new Error(`Failed to fetch opportunity types: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Opportunity types response:", data);
  return data.map((item: OpportunityType) => ({
    value: item.nome.toLowerCase().replace(/\s+/g, "_"),
    label: item.nome,
    id: item.id,
  }));
}

async function fetchDepartments(): Promise<{ value: string; label: string; id: number }[]> {
  const response = await apiFetch("http://localhost:8000/departamentos/");
  if (!response.ok) {
    throw new Error(`Failed to fetch departments: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Departments response:", data);
  const mappedData = data.map((item: Department) => {
    console.log("Mapping department:", item);
    return {
      value: item.name.toLowerCase().replace(/\s+/g, "_"),
      label: item.name,
      id: item.id,
    };
  });
  console.log("Mapped departments:", mappedData);
  return mappedData;
}

export function useOpportunityFormData() {
  const { data: opportunityTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ["opportunityTypes"],
    queryFn: fetchOpportunityTypes,
    staleTime: 30 * 60 * 1000, // Data is considered fresh for 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // Keep unused data in cache for 24 hours
  });

  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime: 30 * 60 * 1000, // Data is considered fresh for 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // Keep unused data in cache for 24 hours
  });

  console.log("Hook departments:", departments);

  return {
    opportunityTypes,
    departments,
    isLoading: isLoadingTypes || isLoadingDepartments,
  };
} 