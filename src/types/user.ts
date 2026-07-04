import { AcademicUnit, Residence, University } from "./university";

export interface SessionData {
  name: string;
  role: string;
  userId: string;
  provider: string;
  isVerified: boolean;
  isProfileComplete: boolean | null;
}

export interface StudentDetails {
  university: University;
  academicSession: string;
  academicUnit: AcademicUnit;
  residence: Residence | null;
}

export interface User {
  name: string;
  email: string;
  emailHash: string;
  password?: string;
  createdAt: Date;
  role: "STUDENT";
  userId: string;
  provider: string;
  isVerified: boolean;
  studentDetails: null | StudentDetails;
  isProfileComplete: boolean;
}

export type UserProfile = Omit<User, "password" | "emailHash">;

export interface UpdateProfileInput {
  name: string;
  university: string;
  academicUnit: string;
  residence: string;
  session: string;
}
