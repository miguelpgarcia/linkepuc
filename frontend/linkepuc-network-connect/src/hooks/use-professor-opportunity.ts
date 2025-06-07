
import { ProfessorOpportunityDetail } from "@/types/professor";

// Mock data for professor opportunity details
const mockOpportunityDetail: ProfessorOpportunityDetail = {
  id: "1",
  title: "Monitoria de Estruturas de Dados",
  type: "monitoria",
  department: "Departamento de Informática",
  location: "Gávea",
  modality: "Presencial",
  workload: "12h semanais",
  createdAt: "2025-03-10T10:00:00Z",
  deadline: "2025-04-01T23:59:59Z",
  status: "em_analise",
  description: `Estamos procurando um monitor dedicado para auxiliar na disciplina de Estruturas de Dados.

O monitor selecionado irá:
- Auxiliar os alunos em horários de monitoria
- Ajudar na correção de exercícios
- Participar de reuniões semanais com o professor
- Preparar material de apoio

Carga horária: 12 horas semanais
Duração: Semestre 2025.1 completo`,
  interests: ["Ciência de Dados", "Algoritmos", "Programação", "Matemática", "Estruturas de Dados"], // Added interests
  benefits: {
    remuneracao: "R$ 700,00",
    desconto_mensalidade: "20%",
    horas_complementares: "40h"
  },
  metrics: {
    totalCandidates: 12,
    eligibleCandidates: 8,
    withMotivationLetter: 9,
    courseDistribution: [
      { name: "Computação", value: 45 },
      { name: "Engenharia", value: 25 },
      { name: "Matemática", value: 15 },
      { name: "Outros", value: 15 }
    ],
    semesterDistribution: [
      { name: "1º-3º", value: 20 },
      { name: "4º-6º", value: 50 },
      { name: "7º-10º", value: 30 }
    ]
  },
  candidates: [
    {
      id: "c1",
      name: "Ana Lúcia",
      course: "Direito",
      grade: 9.3,
      interests: ["Ciência de Dados"],
      hasMotivationLetter: true,
      motivationLetter: "Sempre tive interesse em métodos quantitativos aplicados ao Direito. Esta monitoria representa uma oportunidade única para desenvolver minhas habilidades analíticas e contribuir com uma perspectiva jurídica para o estudo de estruturas de dados.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80"
    },
    {
      id: "c2",
      name: "João Pedro",
      course: "Computação",
      grade: 8.7,
      interests: ["Ciência de Dados", "Matemática"],
      hasMotivationLetter: true,
      motivationLetter: "Meu entusiasmo por estruturas de dados começou nas primeiras aulas da disciplina, quando percebi o impacto que algoritmos eficientes podem ter. Tenho experiência prática com tutoria informal entre colegas e gostaria de contribuir para o aprendizado dos próximos alunos da matéria.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80"
    },
    {
      id: "c3",
      name: "Roberto Silva",
      course: "Engenharia",
      grade: 7.8,
      interests: ["Programação", "Física"],
      hasMotivationLetter: false,
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80"
    }
  ]
};

export const useProfessorOpportunity = (id: string) => {
  // In a real app, you would fetch the opportunity data based on the ID
  return { opportunity: mockOpportunityDetail };
};
