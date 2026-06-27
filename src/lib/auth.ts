import { signInUser } from "@/actions/auth/signIn"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const response = await signInUser({ email: credentials.email, password: credentials.password })

        if (!response.success) {
          return null
        }
        return {
          id: response.data?.userId as string,
          name: response.data?.name as string,
          email: credentials.email as string,
          role: response.data?.role as string,
          provider: response.data?.provider as string,
          isVerified: response.data?.isVerified as boolean,
          userId: response.data?.userId as string,
          isProfileComplete:response.data?.isProfileComplete,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.provider = user.provider
        token.isVerified = user.isVerified
        token.userId = user.userId
        token.isProfileComplete = user.isProfileComplete
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.userId = token.userId as string
        session.user.provider = token.provider as string
        session.user.role = token.role as string
        session.user.isVerified = token.isVerified as boolean
        session.user.isProfileComplete = token.isProfileComplete as boolean
      }
      return session
    },
  },
}
