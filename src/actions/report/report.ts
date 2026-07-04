"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { FrontendIncidentPayload, Report, ReportFilters, ServerReturn, UserReportCardData } from "@/types"
import { getServerSession } from "next-auth"
import { generateUniqueId } from "@/lib/utils"

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
        } as UserReportCardData))

        return { success: true, message: "Reports fetched successfully", data: { reports: mappedReports, hasMore } }
    } catch (error) {
        console.error("Error in getUserReports:", error)
        return { success: false, message: "Failed to fetch reports" }
    }
}