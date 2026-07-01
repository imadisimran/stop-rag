"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { decryptData, generateBlindIndex } from "@/lib/encryption"
import { ServerReturn, User } from "@/lib/types"
import { getServerSession } from "next-auth"

export type UserProfile = Omit<User, "password" | "emailHash"> 

export const getProfile = async ():Promise<ServerReturn<UserProfile>> => {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return { success: false, message: "Unauthorized user" }
    }
    try {
        const usersCollection = await dbConnect("users")
        const user = await usersCollection.findOne({ emailHash: generateBlindIndex(session.user.email || "") },{projection:{password:0,_id:0,emailHash:0}}) as UserProfile | null
        if(!user){
            return { success: false, message: "Profile not found" }
        }
        return { success: true, data: {...user,email:decryptData(user.email),name:decryptData(user.name)} }
    }
    catch(e){
        console.log(e)
        return {success:false,message:"Failed to fetch profile"}
    }
   
}