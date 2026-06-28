"use server"

import { dbConnect } from "@/lib/dbConnect"
import { IncidentPayload } from "@/lib/reportTypes"
import {ServerReturn } from "@/lib/types"
import { nanoid } from "nanoid"

export const postReport = async (
    payload: IncidentPayload
): Promise<ServerReturn<{ postId: string }>> => {
    const { university, location, incidentType, description, date } = payload

    if (!university.trim() || !location.type.trim() || !location.name.trim() || !location.id.trim() || !incidentType.trim() || !description.trim() || !date) {
        return { success: false, message: "All fields are required" }
    }

    console.log(payload)

    try {
        const postId = nanoid(10)

        const newReport:Report={
            postId,
            university,
            location:{
                type:location.type,
                id:location.id,
                name:location.name,
            },
            incidentType,
            description,
            date,
            proofUrl:
        }

        const collection = await dbConnect("incidents")

        const result = await collection.insertOne({
            postId,
            university,
            location,
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