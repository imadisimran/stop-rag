import { StudentDetails } from "./user";

export interface ProofUrl {
  type: string;
  publicId: string;
  secureUrl: string;
}

export interface FrontendIncidentPayload {
  university: string;
  location: string;
  incidentType: string;
  description: string;
  proofUrls: ProofUrl[] | null;
  date: Date;
}

export interface ReportStudentInfo extends StudentDetails {
  emailHash: string;
  userId: string;
}

export type ReportStatus = "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED" | "APPEALED" | "QUEUED";

export interface AdminVerification {
  isAppealed: boolean;
  appealNote: string;
  status: ReportStatus;
  adminId?: string;
  appealSubmittedAt?: Date | null;
  adminNote?: string;
  resolvedAt?: Date;
}

export interface Report {
  postId: string;
  university: {
    id: string;
    name: string;
  };
  location: {
    type: string;
    id: string;
    name: string;
  };
  incidentType: string;
  description: string;
  date: Date;
  proofUrls: ProofUrl[] | null;
  createdAt: Date;
  status: ReportStatus;
  student: ReportStudentInfo;
  updatedAt?: {
    timestamp: Date;
    status: ReportStatus;
    verifiedBy: string;
    adminId: string | null;
    note: string | null;
  }[];
  upVotesCount: number;
  upVotesBy: string[];
  adminVerification: null | AdminVerification;
  sanitizedTitle?: string;
  sanitizedDescription?: string;
  detectedSeverity?: 'LOW' | 'MEDIUM' | 'HIGH';
  rejectionReason?: string | null;
}
