import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { db } from "./db";
import { userRooms } from "./db/schema";
// import { users } from "./db/schema";
// import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Resend({
    from: "Acme <onboarding@resend.dev>"
  })],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "database",
  },

  events: {
    async createUser(data) {
      await db.insert(userRooms).values({
        userId: data.user.id!,
        roomId: "183f9797-92c3-4251-a8e0-6556e68ffdc8",
      })
    }
  }

  // callbacks: {
  //   async session({ session, user }) {
  //     const dbUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  //
  //     return {
  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: user.id,
  //         role: dbUser[0]?.role || "user"
  //       }
  //     }
  //   },
  //
  //   async jwt({ token, user, session, trigger }) {
  //     if (user) {
  //       token.role = user.role;
  //       token.id = user.id
  //     }
  //
  //     if (trigger === "update" && session?.user) {
  //       token.role = session.user.role
  //     }
  //
  //     return token;
  //   }
  // }
});
