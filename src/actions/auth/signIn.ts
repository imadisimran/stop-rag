"use server"

import { dbConnect } from "@/lib/dbConnect";
import { decryptData, encryptData, generateBlindIndex } from "@/lib/encryption";
import { ServerReturn, SessionData, User } from "@/types";
import bcrypt from "bcryptjs";
import { generateUniqueId } from "@/lib/utils";

interface SignInData {
    email: string;
    password: string
}
export const signInUser = async (data: SignInData): Promise<ServerReturn<SessionData>> => {
    const { email, password } = data;
    if (!email.trim() || !password.trim()) {
        return { success: false, message: "All fields are required" };
    }
    try {

        const usersCollection = await dbConnect<User>("users");

        const user = await usersCollection.findOne({
            emailHash: generateBlindIndex(email),
        }, { projection: { name: 1, role: 1, userId: 1, provider: 1, isVerified: 1, password: 1, isProfileComplete: 1 } });
        if (!user?._id) {
            return { success: false, message: "User not found" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
        if (!isPasswordValid) {
            return { success: false, message: "Invalid password" };
        }

        const SessionData: SessionData = {
            name: decryptData(user.name),
            role: user.role,
            userId: user.userId,
            provider: user.provider,
            isVerified: user.isVerified,
            isProfileComplete: user.isProfileComplete,
        };

        return {
            success: true,
            message: "User logged in successfully",
            data: SessionData,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
};

interface SocialLoginData {
    name: string;
    email: string;
    provider: string;
    isVerified: boolean;
}

export const socialLogin = async (data: SocialLoginData): Promise<ServerReturn<SessionData>> => {
    const { name, email, provider, isVerified } = data;
    if (!name.trim() || !email.trim() || !provider.trim()) {
        return { success: false, message: "All fields are required" };
    }
    try {
        const usersCollection = await dbConnect<User>("users");

        const user = await usersCollection.findOne({
            emailHash: generateBlindIndex(email),
        }, { projection: { name: 1, role: 1, userId: 1, provider: 1, isVerified: 1, isProfileComplete: 1 } });

        if (user) {
            return {
                success: true,
                message: "User Data Retrival Successful",
                data: {
                    name: user.name,
                    role: user.role,
                    userId: user.userId,
                    provider: user.provider,
                    isVerified: user.isVerified,
                    isProfileComplete: user.isProfileComplete,
                },
            };
        }

        const newUser: User = {
            name: encryptData(name),
            email: encryptData(email),
            emailHash: generateBlindIndex(email),
            createdAt: new Date(),
            role: "STUDENT",
            userId: generateUniqueId(),
            provider,
            isVerified,
            isProfileComplete: false,
            studentDetails: null
        };

        const result = await usersCollection.insertOne(newUser);
        if (result.acknowledged) {
            return {
                success: true,
                message: "User registered successfully",
                data: {
                    name: newUser.name,
                    role: newUser.role,
                    userId: newUser.userId,
                    provider: newUser.provider,
                    isVerified: newUser.isVerified,
                    isProfileComplete: newUser.isProfileComplete,
                }
            };
        }

        return { success: false, message: "Failed to register user" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
};