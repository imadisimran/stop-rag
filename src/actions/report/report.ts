"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { IncidentPayload, Report } from "@/lib/reportTypes"
import {ServerReturn } from "@/lib/types"
import { getServerSession } from "next-auth"
import { generateUniqueId } from "@/lib/utils"

export const postReport = async (
    payload: IncidentPayload
): Promise<ServerReturn<{ postId: string }>> => {
    const session=await getServerSession(authOptions)

    if(!session){
        return {success:false,message:"User must login for posting report"}
    }
    const { university, location, incidentType, description, date } = payload

    if (!university.trim() || !location.trim() || !incidentType.trim() || !description.trim() || !date) {
        return { success: false, message: "All fields are required" }
    }

    // console.log(payload)

    try {
        const postId = generateUniqueId(14)
        const [locType, locId, locName] = location.split(":")

        const newReport:Report={
            postId,
            university,
            location:{
                type:locType || "",
                id:locId || "",
                name:locName || "",
            },
            incidentType,
            description,
            date,
            proofUrl:null,
            createdAt:new Date(),
            status:"PENDING",
        }

        const collection = await dbConnect("incidents")

        const result = await collection.insertOne({
            postId,
            university,
            location: {
                type: locType || "",
                id: locId || "",
                name: locName || "",
            },
            incidentType,
            description,
            proofUrls: [],
            createdAt: new Date(),
            date: new Date(date),
            status: "PENDING",
        })

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