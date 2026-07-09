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

export type ReportStatus = "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED" | "APPEALED" | "QUEUED" | "FAILED";

export type ReportSeverity = "HIGH" | "MEDIUM" | "LOW";

export interface AdminVerification {
  isAppealed: boolean;
  appealNote: string;
  status: ReportStatus;
  adminId?: string;
  appealSubmittedAt?: Date | null;
  adminNote?: string;
  resolvedAt?: Date;
}

export interface UpdatedAt {
  timestamp: Date;
  status: ReportStatus;
  verifiedBy?: string;
  adminId?: string | null;
  note?: string | null;
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
  updatedAt?: UpdatedAt[];
  upVotesCount: number;
  upVotesBy: string[];
  adminVerification: null | AdminVerification;
  sanitizedTitle?: string;
  sanitizedDescription?: string;
  detectedSeverity?: ReportSeverity;
  rejectionReason?: string | null;
}


export interface UserReportCardData {
  postId: string;
  createdAt: Date;
  title: string;
  incidentType: string;
  description: string;
  status: ReportStatus;
  severity: ReportSeverity;
  isAppealed?: boolean;
}

export interface ReportFilters {
  searchQuery?: string;
  statusFilter?: string;
  severityFilter?: string;
  dateSort?: string;
  page?: number;
  limit?: number;
}

export interface PublicReportCardData {
  postId: string;
  createdAt: Date;
  title: string;
  description: string;
  status: ReportStatus;
  severity: ReportSeverity;
  location: string;
  university: string;
  thumbnailUrl: string | null;
  likes: number;
  comments: number;
  incidentType: string;
  userId: string;
}

export interface PublicReportFilters {
  searchQuery?: string;
  severityFilter?: string;
  dateSort?: string;
  page?: number;
  limit?: number;
}
export interface IncidentDetails {
  postId: string;
  createdAt: Date;
  date: Date;
  title: string;
  description: string;
  incidentType: string;
  status: string;
  severity?: ReportSeverity;
  university: string;
  location: string;
  student: {
    userId: string;
    academicSession: string;
  };
  proofUrls: ProofUrl[] | null;
  upVotesCount: number;
  updatedAt?: UpdatedAt[];
}


export type PublicDetailsReport = Omit<
  Report,
  "description" | "adminVerification" | "rejectionReason" | "university" | "location" | "student" | "upVotesBy"
> & {
  university: {
    name: string;
  };
  location: {
    name: string;
  };
  student: {
    userId: string;
    academicSession: string;
  };
};

export interface UserReportDetails extends IncidentDetails {
  rawDescription: string;
  rejectionReason?: string | null;
  adminVerification?: AdminVerification | null;
}