"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { decryptData, encryptData, generateBlindIndex } from "@/lib/encryption"
import { AcademicUnit, Residence, ServerReturn, StudentDetails, University, User, UserProfile, UpdateProfileInput } from "@/types"
import { getServerSession } from "next-auth"

export const getProfile = async (): Promise<ServerReturn<UserProfile>> => {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return { success: false, message: "Unauthorized user" }
    }
    try {
        const usersCollection = await dbConnect("users")
        const user = await usersCollection.findOne({ emailHash: generateBlindIndex(session.user.email || "") }, { projection: { password: 0, _id: 0, emailHash: 0 } }) as UserProfile | null
        if (!user) {
            return { success: false, message: "Profile not found" }
        }
        return { success: true, data: { ...user, email: decryptData(user.email), name: decryptData(user.name) } }
    }
    catch (e) {
        console.log(e)
        return { success: false, message: "Failed to fetch profile" }
    }

}


export const updateProfile = async (
    data: UpdateProfileInput
): Promise<ServerReturn> => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.userId) {
        return { success: false, message: "Unauthorized User" }
    }

    console.log(data)

    const { name, university, academicUnit, residence, session: academicSession } = data

    if (!name || !name.trim()) {
        return { success: false, message: "Name is required" }
    }

    if (!university || !university.trim()) {
        return { success: false, message: "University is required" }
    }

    const uniParts = university.split(":")
    if (uniParts.length !== 2) {
        return { success: false, message: "Invalid university format" }
    }

    if (!academicUnit || !academicUnit.trim()) {
        return { success: false, message: "Academic unit is required" }
    }

    const academicUnitParts = academicUnit.split(":")
    if (academicUnitParts.length !== 3) {
        return { success: false, message: "Invalid academic unit format" }
    }

    if (!academicSession || !academicSession.trim()) {
        return { success: false, message: "Academic session is required" }
    }

    try {
        const [uniId, uniName] = uniParts
        const [academicType, academicId, academicName] = academicUnitParts

        const academicUnitData = {
            type: academicType,
            id: academicId,
            name: academicName
        } as AcademicUnit

        // Check if university has residence options (HALL or HOSTEL)
        const uniCollection = await dbConnect("universities")
        const universityDoc = await uniCollection.findOne({ id: uniId })
        const locations = (universityDoc?.locations || []) as any[]
        const hasResidence = locations.some(loc => loc.type === "HALL" || loc.type === "HOSTEL")

        let residenceData: Residence | null = null

        if (hasResidence) {
            if (!residence || !residence.trim()) {
                return { success: false, message: "Residence is required" }
            }

            const residenceParts = residence.split(":")
            if (residenceParts.length !== 3) {
                return { success: false, message: "Invalid residence format" }
            }

            const [residenceType, residenceId, residenceName] = residenceParts
            residenceData = {
                type: residenceType,
                id: residenceId,
                name: residenceName
            } as Residence
        }

        const universityData = { name: uniName, id: uniId } as University

        const usersCollection = await dbConnect("users")

        const studentDetails: StudentDetails = {
            university: universityData,
            academicSession: academicSession || "",
            academicUnit: academicUnitData,
            residence: residenceData
        }

        const result = await usersCollection.updateOne(
            { userId: session.user.userId },
            {
                $set: {
                    name: encryptData(name.trim()),
                    isProfileComplete: true,
                    studentDetails
                }
            }
        )

        if (result.matchedCount === 0) {
            return { success: false, message: "User profile not found" }
        }

        return {
            success: true,
            message: "Profile updated successfully",
        }
    } catch (e) {
        console.error("Error updating profile:", e)
        return { success: false, message: "Failed to update profile" }
    }
}