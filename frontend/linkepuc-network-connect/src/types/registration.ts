
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

export type RegistrationData = {
  fullName: string;
  email: string;
  role: UserRole;
  course: string;
  currentPeriod: string;
  mainObjective: MainObjective;
  interests: string[];
};
