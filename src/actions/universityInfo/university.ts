"use server"

import { dbConnect } from "@/lib/dbConnect"
import { ServerReturn, University, Location } from "@/types"

export const getUniversities = async (): Promise<ServerReturn<University[]>> => {
    try {
        const uniCollection = await dbConnect("universities")
        const universities = await uniCollection.find({})
            .project({ name: 1, id: 1, _id: 0 })
            .sort({ name: 1 })
            .toArray() as University[]
        return { success: true, data: universities }
    } catch (error: any) {
        return { success: false, error: error.message || "Something went wrong fetching universities" }
    }
}

export const getLocations = async (uniId: string): Promise<ServerReturn<Location[]>> => {
    try {
        const uniCollection = await dbConnect("universities")
        const universityDoc = await uniCollection.findOne({ id: uniId })
        const locations = (universityDoc?.locations || []) as Location[]
        return { success: true, data: locations }
    } catch (error: any) {
        return { success: false, error: error.message || "Something went wrong fetching locations" }
    }
}