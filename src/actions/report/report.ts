"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { FrontendIncidentPayload, Report, ReportStudentInfo } from "@/lib/reportTypes"
import { ServerReturn } from "@/lib/types"
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

        const userData=await dbConnect("users")
        const user = await userData.findOne({userId:session.user.userId},{projection:{emailHash:1,university:1}})
        if(!user){
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
            student:{
                emailHash:user.emailHash || "",
                userId:session.user.userId || "",
                university:user.university as ReportStudentInfo["university"],
            },
            upVotesBy:[],
            upVotesCount:0,
            adminVerification:null
            
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