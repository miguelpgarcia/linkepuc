import * as z from "zod";

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
