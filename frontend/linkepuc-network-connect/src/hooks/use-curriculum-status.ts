import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";

interface CurriculumStatus {
  has_curriculum: boolean;
  upload_date: number | null;
}

const fetchCurriculumStatus = async (): Promise<CurriculumStatus> => {
  const response = await apiFetch("http://localhost:8000/historicos/status");
  if (!response.ok) {
    throw new Error("Failed to fetch curriculum status");
  }
  return response.json();
};

export const useCurriculumStatus = () => {
  return useQuery({
    queryKey: ["curriculumStatus"],
    queryFn: fetchCurriculumStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 