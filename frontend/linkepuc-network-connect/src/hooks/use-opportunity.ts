
import { Opportunity } from "@/types/opportunity";

// This would come from your API in a real app
const mockOpportunity: Opportunity = {
  id: "1",
  title: "Monitoria de Estruturas de Dados",
  type: "monitoria",
  department: "Departamento de Informática",
  professor: {
    id: "prof1",
    name: "Prof. Ricardo Silva",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    subjects: ["Estruturas de Dados", "Algoritmos", "Programação OO"],
    otherOpportunities: 3
  },
  postedAt: "2025-03-10T10:00:00Z",
  deadline: "2025-04-01T23:59:59Z",
  description: `Estamos procurando um monitor dedicado para auxiliar na disciplina de Estruturas de Dados.

O monitor selecionado irá:
- Auxiliar os alunos em horários de monitoria
- Ajudar na correção de exercícios
- Participar de reuniões semanais com o professor
- Preparar material de apoio

Carga horária: 12 horas semanais
Duração: Semestre 2025.1 completo`,
  interests: ["Ciência de Dados", "Algoritmos", "Programação", "Matemática", "Estruturas de Dados"],
  requirements: [
    {
      id: "req1",
      description: "Já ter cursado a disciplina",
      isMet: true,
      details: "Cursou em 2024.1 com nota 9.2"
    },
    {
      id: "req2",
      description: "Média mínima: 8.0",
      isMet: true,
      details: "Sua média é 9.2"
    },
    {
      id: "req3",
      description: "Enviar carta de motivação",
      isMet: false
    },
    {
      id: "req4",
      description: "Ter participado de monitorias anteriores",
      isMet: false,
      optional: true
    }
  ],
  candidateInfo: {
    grade: 9.2,
    semester: "2024.1",
    compatibility: "Alta",
    hasApplied: false,
    applicationDate: null,
    status: null
  },
  benefits: {
    desconto_mensalidade: "20%",
    horas_complementares: "40h"
  }
};

export const useOpportunity = (id: string) => {
  // In a real app, you would fetch the opportunity data based on the ID
  return { opportunity: mockOpportunity };
};
