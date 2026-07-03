"use server"

import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/dbConnect"
import { ServerReturn, User } from "@/lib/types"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { ChangePasswordValues } from "@/components/profile/change-password-schema"

export const changePassword = async (
    data: ChangePasswordValues
): Promise<ServerReturn> => {
    const session = await getServerSession(authOptions)

    // User must be authenticated to change password
    if (!session?.user?.userId) {
        return { success: false, message: "Unauthorized User" }
    }

    if (session?.user?.provider !== "credentials") {
        return { success: false, message: "You cannot change password for this account" }
    }

    const { currentPassword, newPassword, confirmPassword } = data

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, message: "All fields are required" }
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: "New passwords do not match" }
    }

    if (newPassword.length < 8) {
        return { success: false, message: "Password must be at least 8 characters" }
    }

    try {
        const usersCollection = await dbConnect<User>("users")

        // Find the user by ID
        const user = await usersCollection.findOne({ userId: session.user.userId }, { projection: { password: 1, provider: 1 } })

        if (!user) {
            return { success: false, message: "User not found" }
        }

        // For OAuth users (Google, etc.) they might not have a password
        if (user.provider !== "credentials" || !user.password) {
            return { success: false, message: "Cannot change password for social login accounts" }
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return { success: false, message: "Incorrect current password" }
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        // Update password in DB
        const result = await usersCollection.updateOne(
            { userId: session.user.userId },
            { $set: { password: hashedNewPassword } }
        )

        if (result.matchedCount === 0) {
            return { success: false, message: "Failed to update password" }
        }

        return {
            success: true,
            message: "Password updated successfully",
        }

    } catch (e) {
        console.error("Error changing password:", e)
        return { success: false, message: "Failed to change password" }
    }
}
