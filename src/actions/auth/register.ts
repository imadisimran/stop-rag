"use server"

import { dbConnect } from "@/lib/dbConnect";
import { encryptData, generateBlindIndex } from "@/lib/encryption";
import { ServerReturn, User } from "@/lib/types";
import bcrypt from "bcryptjs";
import { nanoid } from 'nanoid';

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData): Promise<ServerReturn> => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
        return { success: false, message: "All fields are required" };
    }
    try {
        const emailHash = generateBlindIndex(email);


        const userCollection = await dbConnect("users")
        const existingUser = await userCollection.findOne({ emailHash }, { projection: { _id: 1 } });
        if (existingUser?._id) {
            return { success: false, message: "User already exists" };
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            name: encryptData(name),
            email: encryptData(email),
            password: encryptedPassword,
            emailHash,
            createdAt: new Date(),
            role: "STUDENT",
            userId: nanoid(10),
            provider: "credentials",
            isVerified: false,
            studentDetails: null,
            isProfileComplete: false,
        };

        const result = await userCollection.insertOne(newUser);


        return {
            success: result.acknowledged,
            message: result.acknowledged
                ? "User registered successfully"
                : "Failed to register user",
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
};