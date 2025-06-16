export type UserRole = "student" | "professor" | "other";

export type MainObjective = 
  | "mentoring"
  | "academic_projects"
  | "networking"
  | "opportunities"
  | "curriculum"
  | "other";

export type Interest = {
  category: string;
  subInterests: string[];
};

export interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  course: string;
  currentPeriod: string;
  mainObjective: MainObjective;
  interests: number[];
}
