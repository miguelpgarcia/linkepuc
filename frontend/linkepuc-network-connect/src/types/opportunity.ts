
export interface Professor {
  id: string;
  name: string;
  avatar?: string;
  subjects: string[];
  otherOpportunities: number;
}

export interface Requirement {
  id: string;
  description: string;
  isMet: boolean;
  details?: string;
  optional?: boolean;
}

export type CandidateCompatibility = "Alta" | "Média" | "Baixa";

export interface CandidateInfo {
  grade: number;
  semester: string;
  compatibility: CandidateCompatibility;
  hasApplied: boolean;
  applicationDate: string | null;
  status: string | null;
}

export interface Benefits {
  remuneracao?: string;
  desconto_mensalidade?: string;
  horas_complementares?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  department: string;
  professor: Professor;
  postedAt: string;
  deadline: string;
  description: string;
  requirements: Requirement[];
  candidateInfo: CandidateInfo;
  benefits?: Benefits;
  interests?: string[];
}
