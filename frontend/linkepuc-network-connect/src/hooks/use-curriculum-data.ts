import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";

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

const fetchCurriculumData = async (): Promise<HistoricoEntry[]> => {
  const response = await apiFetch("http://localhost:8000/historicos/");
  if (!response.ok) {
    throw new Error("Failed to fetch curriculum data");
  }
  return response.json();
};

export const useCurriculumData = () => {
  return useQuery({
    queryKey: ["curriculumData"],
    queryFn: fetchCurriculumData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 