"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { getServerSession } from "next-auth"
import { ServerReturn, Report, UpdatedAt } from "@/types"

export const submitAppeal = async (
    postId: string,
    appealNote: string
): Promise<ServerReturn<null>> => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, message: "User must login to submit an appeal" }
    }

    if (!appealNote || !appealNote.trim()) {
        return { success: false, message: "Appeal reason/note is required" }
    }

    try {
        const collection = await dbConnect<Report>("incidents")
        const report = await collection.findOne({ postId, "student.userId": session.user.userId }, { projection: { adminVerification: 1 } })

        if (!report) {
            return { success: false, message: "Report not found or unauthorized" }
        }

        // Feature: A user can only appeal once
        if (report.adminVerification?.isAppealed || report.status === "APPEALED") {
            return { success: false, message: "This report has already been appealed and can only be appealed once" }
        }

        // Restrict to rejected reports only
        if (report.status !== "REJECTED") {
            return { success: false, message: "Only rejected reports can be appealed" }
        }

        const updatedAdminVerification = {
            isAppealed: true,
            appealNote: appealNote.trim(),
            status: "APPEALED" as const,
            appealSubmittedAt: new Date(),
        }

        const result = await collection.updateOne(
            { postId, "student.userId": session.user.userId },
            {
                $set: {
                    status: "APPEALED",
                    adminVerification: updatedAdminVerification,
                },
                $push: {
                    updatedAt: {
                        timestamp: new Date(),
                        status: "APPEALED",
                        note: appealNote.trim(),
                    } as UpdatedAt
                } as any
            }
        )

        return {
            success: result.acknowledged,
            message: result.acknowledged ? "Appeal submitted successfully" : "Failed to submit appeal",
        }
    } catch (error) {
        console.error("Error in submitAppeal:", error)
        return { success: false, message: "Something went wrong while submitting the appeal" }
    }
}
