import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";
import { ProfessorOpportunityDetail } from "@/types/professor";

// Fetch a single opportunity from the API
const fetchOpportunity = async (id: string): Promise<ProfessorOpportunityDetail> => {
  try {
    const response = await apiFetch(API_ENDPOINTS.VAGAS.BY_ID(id));
    if (!response.ok) {
      throw new Error("Failed to fetch opportunity");
    }
    const data = await response.json();
    
    // Get candidates for this opportunity
    const candidatesResponse = await apiFetch(API_ENDPOINTS.CANDIDATURAS.BY_VAGA(id));
    const candidates = candidatesResponse.ok ? await candidatesResponse.json() : [];
    
    // Calculate course distribution from candidates
    const courseDistribution = candidates.reduce((acc: any[], candidate: any) => {
      const course = candidate.candidato.curso || 'Outros';
      const existingCourse = acc.find(item => item.name === course);
      if (existingCourse) {
        existingCourse.value++;
      } else {
        acc.push({ name: course, value: 1 });
      }
      return acc;
    }, []);
    
    // Transform the backend data to match the frontend interface
    return {
      id: data.id.toString(),
      title: data.titulo,
      type: data.tipo.nome,
      department: data.department?.name || "",
      location: data.location?.name || "",
      modality: "Presencial", // Default value since it's not in the backend yet
      workload: "12h semanais", // Default value since it's not in the backend yet
      createdAt: data.criado_em,
      deadline: data.prazo,
      status: data.status,
      description: data.descricao,
      interests: data.interesses?.map((i: any) => i.interesse.nome) || [],
      benefits: {
        remuneracao: data.remuneracao ? `R$ ${data.remuneracao.toFixed(2)}` : undefined,
        desconto_mensalidade: data.desconto ? `${data.desconto}%` : undefined,
        horas_complementares: data.horas_complementares ? `${data.horas_complementares}h` : undefined
      },
      metrics: {
        totalCandidates: candidates.length,
        eligibleCandidates: candidates.length, // For now, consider all candidates eligible
        withMotivationLetter: 0, // Not implemented in backend yet
        courseDistribution,
        semesterDistribution: [] // Not implemented in backend yet
      },
      candidates: candidates.map((c: any) => ({
        id: c.candidato.id.toString(),
        name: c.candidato.usuario,
        course: c.candidato.curso || 'Não informado',
        grade: 0, // Not implemented in backend yet
        interests: [], // Not implemented in backend yet
        hasMotivationLetter: false, // Not implemented in backend yet
        imageUrl: c.candidato.avatar || undefined
      }))
    };
  } catch (error) {
    if (error instanceof Error && error.message === "No authentication token found") {
      window.location.href = "/login";
    }
    throw error;
  }
};

export const useProfessorOpportunity = (id: string) => {
  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ["professorOpportunity", id],
    queryFn: () => fetchOpportunity(id),
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  return { opportunity, isLoading, error };
};
