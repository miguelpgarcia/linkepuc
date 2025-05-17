
export interface Candidate {
  id: string;
  name: string;
  course: string;
  grade: number;
  interests: string[];
  hasMotivationLetter: boolean;
  imageUrl?: string;
  motivationLetter?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface OpportunityMetricsData {
  totalCandidates: number;
  eligibleCandidates: number;
  withMotivationLetter: number;
  courseDistribution: ChartData[];
  semesterDistribution: ChartData[];
}

export interface ProfessorOpportunityDetail {
  id: string;
  title: string;
  type: string;
  department: string;
  location: string;
  modality: string;
  workload: string;
  createdAt: string;
  deadline: string;
  status: string;
  description: string;
  interests: string[]; // Added interests
  benefits: {
    remuneracao?: string;
    desconto_mensalidade?: string;
    horas_complementares?: string;
  };
  metrics: OpportunityMetricsData;
  candidates: Candidate[];
}
