export interface ServerReturn<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

// Session Data
export interface SessionData {
  name: string;
  role: string;
  userId: string;
  provider: string;
  isVerified:boolean;
  isProfileComplete:boolean | null;
}

export type IncidentStatus = "urgent" | "reviewing"

export interface Incident {
  id: string
  title: string
  description: string
  status: IncidentStatus
  image: string
  imageAlt: string
  likes: number
  comments: number
  timeAgo: string
  location: string
}

export type FilterType = "All" | "Recent" | "Damage" | "Urgent"

interface AcademicUnit {
  type: "DEPARTMENT" | "INSTITUTE";
  name: string;
  id: string;
};

interface Residence {
  type: "HALL" | "HOSTEL";
  name: string;
  id: string;
};

interface StudentDetails {
  university: string;
  academicSession: string;
  academicUnit: AcademicUnit
  residence: Residence
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
  studentDetails: null | StudentDetails,
  isProfileComplete:boolean
}