import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "帳號", type: "text" },
        password: { label: "密碼", type: "password" },
      },
      async authorize(creds) {
        const username = String(creds?.username ?? "");
        const password = String(creds?.password ?? "");
        if (!username || !password) return null;

        const user = await verifyCredentials(username, password);
        if (!user) return null;

        return {
          id: user.username,
          name: user.name,
          email: `${user.username}@team.local`,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});
