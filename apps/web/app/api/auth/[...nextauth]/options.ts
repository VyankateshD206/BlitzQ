import { signIn } from "@repo/types/index";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password } = credentials;
        const body: signIn = {
          email,
          password,
          provider: "credential"
        }
        const jsonBody = JSON.stringify(body);

        try {
          const resp = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, jsonBody, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (resp.data && resp.data.success) {
            return resp.data.user;
          } else if (resp.data && !resp.data.success) {
            throw new Error(resp.data.message);
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error: any) {
          
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
              throw new Error("Authentication service unavailable");
            } else if (error.response) {
              throw new Error(error.response.data?.message || error.response.data?.error || `Authentication failed (${error.response.status})`);
            } else if (error.request) {
              throw new Error("No response from authentication service");
            } else {
              throw new Error(error.message || "Authentication request failed");
            }
          }
          
          throw new Error(error.message || "Unknown authentication error");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT for sessions
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google') {
        const googleProfile = profile as { email?: string, picture?: string }
        
        if (!googleProfile.email) {
          // For Google auth, we need to throw an Error to properly show custom messages
          throw new Error("Google login failed: No email returned");
        }
        
        const body: signIn = {
          email: googleProfile.email,
          provider: 'google',
          profileImg: googleProfile.picture
        }

        const jsonBody = JSON.stringify(body);

        try {
          const resp = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, jsonBody, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (resp.data && resp.data.success) {
            user.id = resp.data.user.id;
            user.email = resp.data.user.email;
            return true;
          } else if (resp.data && !resp.data.success) {
            // Throw error with the custom message from your API
            throw new Error(resp.data.message);
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error: any) {
          
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
              throw new Error("Authentication service unavailable");
            } else if (error.response) {
              throw new Error(error.response.data?.message || error.response.data?.error || `Authentication failed (${error.response.status})`);
            } else if (error.request) {
              throw new Error("No response from authentication service");
            } else {
              throw new Error(error.message || "Authentication request failed");
            }
          }
          
          throw new Error(error.message || "Unknown authentication error");
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = jwt.sign(user, process.env.NEXTAUTH_SECRET!)
      }
      return token;
    },
    async session({ session, token }) {
      // Add user from token to the session
      session.user = token.accessToken as any;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/signin', // This page will receive the error parameter
  },
};