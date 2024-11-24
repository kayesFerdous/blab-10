import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// import Resend from "next-auth/providers/resend";
import { NextAuthConfig } from "next-auth";
import { db } from "./db";
import { userRooms } from "./db/schema";

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub,
    Google,

    // Resend({
    //   from: "Acme <onboarding@resend.dev>",
    // }),
  ],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user;
  //     const isOnHomePage = nextUrl.pathname === "/";
  //
  //     if (isOnHomePage) return true;
  //     if (isLoggedIn) return true;
  //
  //     return false;
  //   },
  // },
  events: {
    async createUser({ user }) {
      // user.id is string | undefined, so check if it exists
      if (!user.id) {
        throw new Error("User ID is missing during user creation.");
      }
      await db.insert(userRooms).values({
        userId: user.id, // user.id is guaranteed to be a string here
        roomId: "183f9797-92c3-4251-a8e0-6556e68ffdc8",
      });
    },
  },
};

// Export the auth handlers
const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
export { auth, handlers, signIn, signOut };
