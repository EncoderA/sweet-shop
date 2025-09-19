import { getServerSession } from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"

          const response = await axios.post(`${backendUrl}/api/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          })

          const data = response.data

          if (data.success && data.data) {
            return {
              id: data.data.user.id || data.data.user._id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              token: data.data.token, // Store the JWT token from backend
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error.response?.data || error.message)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.token // Store the JWT token in the token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.token = token.accessToken // Add token to session
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/` || url === `${baseUrl}/login`) {
        return `${baseUrl}/shop`
      }
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/shop`
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/"
  },
  session: {
    strategy: "jwt",
  },
}

export const getAuthSession = () => getServerSession(authOptions)