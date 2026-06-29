import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
      provider?: string
      isVerified?: boolean
      userId?: string
      isProfileComplete?: boolean | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role?: string
    provider?: string
    isVerified?: boolean
    userId?: string
    isProfileComplete?: boolean | null
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string
    role?: string
    provider?: string
    isVerified?: boolean
    userId?: string
    isProfileComplete?: boolean | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    provider?: string
    isVerified?: boolean
    userId?: string
    isProfileComplete?: boolean | null
  }
}

