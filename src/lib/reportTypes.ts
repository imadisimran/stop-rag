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

export interface ReportStudentInfo {
  emailHash: string;
  userId: string;
  university: {
    name: string;
    id: string;
    session: string;
  };
}

export type ReportStatus = "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED" | "APPEALED" | "QUEUED";

export interface AdminVerification {
  isAppealed: boolean;
  appealNote: string;
  status:ReportStatus;
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
    name: string
  };
  incidentType: string;
  description: string;
  date: Date;
  proofUrls: ProofUrl[] | null;
  createdAt: Date;
  status: ReportStatus;
  student: ReportStudentInfo;
  updatedAt?: {
    timestamp: Date,
    status: ReportStatus,
    verifiedBy: string,
    adminId: string | null,
    note: string | null
  }[];
  upVotesCount: number;
  upVotesBy: string[];
  adminVerification: null | AdminVerification;

}

// export interface AiVerificationResult {
//     isRaggingIncident?: boolean;
//     sanitizedTitle?: string;
//     sanitizedDescription?: string;
//     detectedSeverity?: "LOW" | "MEDIUM" | "HIGH";
//     rejectionReason?: string | null;
// }

// export interface ReportPayload {
//     university: string;
//     dateTime: Date;
//     harassmentType: string;
//     locationCategory: string;
//     specificLocation: string;
//     narrative: string;
//     proofUrls: CloudinaryUpload[] | null;
//     createdAt: Date;
//     isRaggingIncident?: boolean;
//     sanitizedTitle?: string;
//     sanitizedDescription?: string;
//     detectedSeverity?: "LOW" | "MEDIUM" | "HIGH";
//     rejectionReason?: string | null;
//     verifiedBy?: string;
//     status: "QUEUED" | "PROCESSING" | "PENDING" | "SUBMITTED" | "REJECTED";
//     adminVerification: {
//         isRequested: boolean;
//         appealNote: string;
//         status: "PENDING" | "REJECTED" | "APPROVED";
//         adminId: string;
//         appealSubmittedAt: Date | null;
//         adminNote: string;
//         resolvedAt: Date;
//         resolvedBy: string;
//     } | null;
//     postId: string;
//     studentDetails: {
//         studentEmail: string;
//         userId: string;
//         university: string;
//         academicSession: string;
//     };
//     updatedAt: {
//         timestamp: Date;
//         status: "QUEUED" | "PROCESSING" | "PENDING" | "SUBMITTED" | "REJECTED" | "RESOLVED";
//         verifiedBy: string;
//         adminId: string | null;
//         note: string | null;
//     }[];
//     upVotesCount: number;
//     upVotesBy: string[]

// }