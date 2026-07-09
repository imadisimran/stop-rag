export interface JobData {
    reportId: string;
}

export interface ProofUrl {
    type: string;
    publicId: string;
    secureUrl: string;
}

export interface AiVerdict {
    isRaggingIncident: boolean;
    sanitizedTitle: string;
    sanitizedDescription: string;
    detectedSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
    rejectionReason: string | null;
}

export type ReportStatus = "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED" | "APPEALED" | "QUEUED" | "FAILED";


export interface UpdatedAt {
  timestamp: Date;
  status: ReportStatus;
  verifiedBy?: string;
  adminId?: string | null;
  note?: string | null;
}
