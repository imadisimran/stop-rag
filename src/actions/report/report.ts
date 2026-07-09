"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { FrontendIncidentPayload, Report, ReportFilters, ServerReturn, UserReportCardData, PublicReportCardData, PublicReportFilters, PublicDetailsReport, IncidentDetails, UserReportDetails } from "@/types"
import { getServerSession } from "next-auth"
import { generateUniqueId } from "@/lib/utils"
import { deleteFromCloudinary } from "@/actions/cloudinary/cloudinary"

export const postReport = async (
    payload: FrontendIncidentPayload
): Promise<ServerReturn<{ postId: string }>> => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, message: "User must login for posting report" }
    }
    const { university, location, incidentType, description, date, proofUrls } = payload

    if (!university.trim() || !location.trim() || !incidentType.trim() || !description.trim() || !date) {
        return { success: false, message: "All fields are required" }
    }

    try {

        const userData = await dbConnect("users")
        const user = await userData.findOne({ userId: session.user.userId }, { projection: { emailHash: 1, studentDetails: 1 } })
        if (!user) {
            return { success: false, message: "User not found" }
        }
        const postId = generateUniqueId(14)
        const [locType, locId, locName] = location.split(":")
        const [uniId, uniName] = university.split(":")

        const newReport: Report = {
            postId,
            university: {
                id: uniId,
                name: uniName,
            },
            location: {
                type: locType || "",
                id: locId || "",
                name: locName || "",
            },
            incidentType,
            description,
            date,
            proofUrls,
            createdAt: new Date(),
            status: "PENDING",
            student: {
                emailHash: user.emailHash || "",
                userId: session.user.userId || "",
                university: user.studentDetails.university,
                academicUnit: user.studentDetails.academicUnit,
                residence: user.studentDetails.residence,
                academicSession: user.studentDetails.academicSession,
            },
            upVotesBy: [],
            upVotesCount: 0,
            adminVerification: null

        }

        const collection = await dbConnect("incidents")

        const result = await collection.insertOne(newReport)

        // Fire-and-forget: send to worker for AI verification (don't await)
        if (result.acknowledged) {
            const workerUrl = process.env.WORKER_URL || "http://localhost:4000"
            fetch(`${workerUrl}/api/v1/reports/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId: result.insertedId.toString() }),
            }).catch((err) => console.error("[Worker Notification] Failed to notify worker:", err))
        }

        return {
            success: result.acknowledged,
            message: result.acknowledged ? "Report filed securely" : "Failed to file report",
            data: result.acknowledged ? { postId } : undefined,
        }
    } catch (error) {
        console.error("Error in postReport:", error)
        return { success: false, message: "Something went wrong" }
    }
}


export const getUserReports = async (filters: ReportFilters = {}): Promise<ServerReturn<{ reports: UserReportCardData[], hasMore: boolean }>> => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, message: "User must login to view reports" }
    }

    try {
        const {
            searchQuery = "",
            statusFilter = "All",
            severityFilter = "All",
            dateSort = "newest",
            page = 1,
            limit = 3
        } = filters

        const query: any = { "student.userId": session.user.userId }

        if (searchQuery) {
            query.$or = [
                { sanitizedTitle: { $regex: searchQuery, $options: "i" } },
                { sanitizedDescription: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
                { postId: { $regex: searchQuery, $options: "i" } }
            ]
        }

        if (statusFilter !== "All") {
            if (statusFilter === "Accepted") {
                query.status = "ACCEPTED"
            } else if (statusFilter === "Rejected") {
                query.status = "REJECTED"
            } else if (statusFilter === "Flagged") {
                query.status = { $in: ["FLAGGED"] }
            } else if (statusFilter === "Appealed") {
                query.status = "APPEALED"
            } else if (statusFilter === "Under Review") {
                query.status = { $in: ["PENDING", "PROCESSING", "QUEUED"] }
            }
        }

        if (severityFilter !== "All") {
            if (severityFilter === "Low") {
                query.detectedSeverity = "LOW"
            } else if (severityFilter === "Medium") {
                query.detectedSeverity = "MEDIUM"
            } else if (severityFilter === "High") {
                query.detectedSeverity = "HIGH"
            }
        }

        const sortDir = dateSort === "oldest" ? 1 : -1
        const skipCount = (page - 1) * limit

        const collection = await dbConnect("incidents")
        const reports = await collection.find(query).project({
            postId: 1,
            createdAt: 1,
            sanitizedTitle: 1,
            incidentType: 1,
            sanitizedDescription: 1,
            status: 1,
            detectedSeverity: 1,
            adminVerification: 1,
            _id: 0
        }).sort({ createdAt: sortDir }).skip(skipCount).limit(limit + 1).toArray()

        const hasMore = reports.length > limit
        const paginatedReports = hasMore ? reports.slice(0, limit) : reports

        const mappedReports = paginatedReports.map((report) => ({
            title: report.sanitizedTitle || "Unknown Incident",
            description: report.sanitizedDescription || "No description available",
            status: report.status || "Accepted",
            incidentType: report.incidentType || "N/A",
            createdAt: report.createdAt || new Date(),
            postId: report.postId || "error404",
            severity: report.detectedSeverity || "LOW",
            isAppealed: report.adminVerification?.isAppealed || false,
        } as UserReportCardData))

        return { success: true, message: "Reports fetched successfully", data: { reports: mappedReports, hasMore } }
    } catch (error) {
        console.error("Error in getUserReports:", error)
        return { success: false, message: "Failed to fetch reports" }
    }
}

export const getPublicReports = async (
    filters: PublicReportFilters = {}
): Promise<ServerReturn<{ reports: PublicReportCardData[]; hasMore: boolean }>> => {
    try {
        const {
            searchQuery = "",
            severityFilter = "All",
            dateSort = "newest",
            page = 1,
            limit = 6
        } = filters

        const query: any = {
            status: "ACCEPTED"
        }

        // Severity mapping
        if (severityFilter && severityFilter !== "All") {
            if (severityFilter === "High") {
                query.detectedSeverity = "HIGH"
            } else if (severityFilter === "Medium") {
                query.detectedSeverity = "MEDIUM"
            } else if (severityFilter === "Low") {
                query.detectedSeverity = "LOW"
            }
        }
        // Search query
        if (searchQuery) {
            query.$or = [
                { sanitizedTitle: { $regex: searchQuery, $options: "i" } },
                { sanitizedDescription: { $regex: searchQuery, $options: "i" } },
                { postId: { $regex: searchQuery, $options: "i" } }
            ]
        }

        const sortDir = dateSort === "oldest" ? 1 : -1
        const skipCount = (page - 1) * limit

        const collection = await dbConnect("incidents")
        const reports = await collection.find(query).project({
            postId: 1,
            createdAt: 1,
            sanitizedTitle: 1,
            sanitizedDescription: 1,
            detectedSeverity: 1,
            "location.name": 1,
            "university.name": 1,
            proofUrls: 1,
            status: 1,
            incidentType: 1,
            upVotesCount: 1,
            "student.userId": 1,
            _id: 0,
        }).sort({ createdAt: sortDir }).skip(skipCount).limit(limit + 1).toArray()

        const hasMore = reports.length > limit
        const paginatedReports = hasMore ? reports.slice(0, limit) : reports

        const mappedReports = paginatedReports.map((report) => ({
            postId: report.postId || "",
            createdAt: report.createdAt || new Date(),
            title: report.sanitizedTitle || "Unknown Incident",
            description: report.sanitizedDescription?.length > 100 ? report.sanitizedDescription.slice(0, 100) + "..." : report.sanitizedDescription || "No description available",
            status: report.status || "ACCEPTED",
            severity: report.detectedSeverity || "LOW",
            location: report.location?.name || "Unknown Location",
            thumbnailUrl: report.proofUrls?.[0]?.secureUrl || null,
            likes: report.upVotesCount || 0,
            comments: 0,
            incidentType: report.incidentType || "N/A",
            userId: report.student?.userId || "",
            university: report.university?.name || "Unknown University",
        } as PublicReportCardData))

        return { success: true, message: "Public reports fetched successfully", data: { reports: mappedReports, hasMore } }
    } catch (error) {
        console.error("Error in getPublicReports:", error)
        return { success: false, message: "Failed to fetch public reports" }
    }
}


export const getIncidentById = async (
    postId: string
): Promise<ServerReturn<IncidentDetails | null>> => {
    try {
        const collection = await dbConnect("incidents")
        const report = await collection.findOne(
            { postId },
            {
                projection: {
                    postId: 1,
                    createdAt: 1,
                    date: 1,
                    sanitizedTitle: 1,
                    incidentType: 1,
                    "university.name": 1,
                    detectedSeverity: 1,
                    "student.userId": 1,
                    "student.academicSession": 1,
                    "location.name": 1,
                    status: 1,
                    sanitizedDescription: 1,
                    proofUrls: 1,
                    upVotesCount: 1,
                    updatedAt: 1,
                    _id: 0,
                },
            }
        ) as PublicDetailsReport | null

        if (!report) {
            return { success: false, message: "Incident not found", data: null }
        }

        const mappedIncident: IncidentDetails = {
            postId: report.postId || "",
            createdAt: report.createdAt || new Date(),
            date: report.date || new Date(),
            title: report.sanitizedTitle || "Title Unavailable",
            description: report.sanitizedDescription || "Description Unavailable",
            incidentType: report.incidentType || "N/A",
            status: report.status || "PENDING",
            severity: report.detectedSeverity,
            university: report.university?.name || "Unknown University",
            location: report.location?.name || "Unknown Location",
            student: {
                userId: report.student?.userId || "",
                academicSession: report.student?.academicSession || "N/A",
            },
            proofUrls: report.proofUrls || null,
            upVotesCount: report.upVotesCount || 0,
            updatedAt: report.updatedAt,
        }

        return { success: true, message: "Incident fetched successfully", data: mappedIncident }
    } catch (error) {
        console.error("Error in getIncidentById:", error)
        return { success: false, message: "Failed to fetch incident" }
    }
}


export const getUserReportDetails = async (
    postId: string
): Promise<ServerReturn<UserReportDetails | null>> => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, message: "User must login to view report details" }
    }

    try {
        const collection = await dbConnect("incidents")
        const report = await collection.findOne(
            { postId, "student.userId": session.user.userId },
            {
                projection: {
                    postId: 1,
                    createdAt: 1,
                    date: 1,
                    sanitizedTitle: 1,
                    incidentType: 1,
                    "university.name": 1,
                    detectedSeverity: 1,
                    "student.userId": 1,
                    "student.academicSession": 1,
                    "location.name": 1,
                    status: 1,
                    sanitizedDescription: 1,
                    description: 1,
                    proofUrls: 1,
                    upVotesCount: 1,
                    updatedAt: 1,
                    rejectionReason: 1,
                    adminVerification: 1,
                    _id: 0,
                },
            }
        )

        if (!report) {
            return { success: false, message: "Incident not found or unauthorized", data: null }
        }

        const mappedIncident: UserReportDetails = {
            postId: report.postId || "",
            createdAt: report.createdAt || new Date(),
            date: report.date || new Date(),
            title: report.sanitizedTitle || "Title Unavailable",
            description: report.sanitizedDescription || "Description Unavailable",
            rawDescription: report.description || "",
            incidentType: report.incidentType || "N/A",
            status: report.status || "PENDING",
            severity: report.detectedSeverity,
            university: report.university?.name || "Unknown University",
            location: report.location?.name || "Unknown Location",
            student: {
                userId: report.student?.userId || "",
                academicSession: report.student?.academicSession || "N/A",
            },
            proofUrls: report.proofUrls || null,
            upVotesCount: report.upVotesCount || 0,
            updatedAt: report.updatedAt,
            rejectionReason: report.rejectionReason,
            adminVerification: report.adminVerification,
        }

        return { success: true, message: "Incident fetched successfully", data: mappedIncident }
    } catch (error) {
        console.error("Error in getAuthIncidentById:", error)
        return { success: false, message: "Failed to fetch incident" }
    }
}

export const deleteReport = async (
    postId: string
): Promise<ServerReturn<null>> => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, message: "User must login to delete a report" }
    }

    try {
        const collection = await dbConnect<Report>("incidents")
        const report = await collection.findOne(
            { postId, "student.userId": session.user.userId },
            {
                projection: {
                    postId: 1,
                    "student.userId": 1,
                    proofUrls: 1,
                    _id: 0,
                }
            }
        )

        if (!report) {
            return { success: false, message: "Report not found or unauthorized" }
        }

        const proofUrls = report.proofUrls || []
        if (proofUrls.length > 0) {
            try {
                const deletePromises = proofUrls.map(proof =>
                    deleteFromCloudinary(proof.publicId, proof.type)
                )
                await Promise.all(deletePromises)
            } catch (cloudinaryError) {
                console.error("Failed to delete proof files from Cloudinary:", cloudinaryError)
            }
        }

        const result = await collection.deleteOne({ postId, "student.userId": session.user.userId })

        return {
            success: result.acknowledged && result.deletedCount > 0,
            message: result.acknowledged && result.deletedCount > 0
                ? "Report deleted successfully"
                : "Failed to delete report",
        }
    } catch (error) {
        console.error("Error in deleteReport:", error)
        return { success: false, message: "Something went wrong while deleting the report" }
    }
}
