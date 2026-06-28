export interface IncidentPayload{
  university: string;
  location: string;
  incidentType:string;
  description:string;
  proofUrls:string[];
  date:Date;
}

export interface Report{
    postId: string;
    university: string;
    location: { type: string; id: string; name: string };
    incidentType: string;
    description: string;
    date: Date;
    proofUrl: { secureUrl: string }[] | null;
    createdAt: Date;
    status: "PENDING" | "PROCESSING" | "SUBMITTED" | "REJECTED";
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