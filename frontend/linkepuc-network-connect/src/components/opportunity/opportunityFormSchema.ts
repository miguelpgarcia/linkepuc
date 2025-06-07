import * as z from "zod";
import { apiFetch } from "../../apiFetch";

// Function to fetch opportunity types from the backend
export async function fetchOpportunityTypes(): Promise<{ value: string; label: string }[]> {
  try {
    const response = await apiFetch("http://localhost:8000/vagas/tipo");
    if (!response.ok) {
      throw new Error(`Failed to fetch opportunity types: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((item: { id: number; nome: string }) => ({
      value: item.nome.toLowerCase().replace(/\s+/g, "_"), // Convert to a consistent format
      label: item.nome,
      id: item.id,
    }));
  } catch (error) {
    console.error("Error fetching opportunity types:", error);
    return [];
  }
}

export async function fetchDepartments(): Promise<{ value: string; label: string }[]> {
  try {
    const response = await apiFetch("http://localhost:8000/departamentos/");
    if (!response.ok) {
      throw new Error(`Failed to fetch opportunity types: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((item: { id: number; name: string }) => ({
      value: item.name.toLowerCase().replace(/\s+/g, "_"), // Convert to a consistent format
      label: item.name,
      id: item.id,
    }));
  } catch (error) {
    console.error("Error fetching opportunity types:", error);
    return [];
  }
}

export const formSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }),
  department: z.string().min(3, {
    message: "O departamento é obrigatório",
  }),
  location: z.string().min(1, {
    message: "A localização é obrigatória",
  }),
  type: z.string().min(1, {
    message: "O tipo de oportunidade é obrigatório",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres",
  }),
  benefits: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  remuneracao: z.string().optional(),
  desconto_mensalidade: z.string().optional(),
  horas_complementares: z.string().optional(),
});

export type OpportunityFormValues = z.infer<typeof formSchema>;
