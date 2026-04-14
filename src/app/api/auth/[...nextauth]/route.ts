import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { query } from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("========== GOOGLE LOGIN DATA ==========");

      console.log("USER:", user);
      console.log("ACCOUNT:", account);
      console.log("PROFILE:", profile);

      console.log("======================================");

      const email = user.email;

      if (!email) {
        console.log("❌ No email received");
        return false;
      }

      // 🔥 DB CHECK
      const result = await query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email]
      );

      if (result.rows.length === 0) {
        console.log("❌ User NOT found in DB:", email);
        return false; // ❌ block login
      }

      console.log("✅ User found → login allowed:", email);
      return true; // ✅ allow login
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };