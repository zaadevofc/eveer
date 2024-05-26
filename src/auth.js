import CredentialsProviders from "next-auth/providers/credentials";
import prisma from "./prisma";
import { comparePassword, exclude, hashPassword } from "./utils/tools";

export const NextAuthConfig = {
  providers: [
    CredentialsProviders({
      name: "Credentials",
      credentials: {
        access: { label: "Access", type: "text" },
        email: { label: "Email", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(pay, req) {
        if (pay.access == "login") {
          const user = await prisma.user.findFirst({
            where: { email: pay.email },
          });

          if (!user) return null;
          
          const check = await comparePassword(pay.password, user.password);
          if (!check) return null;

          return exclude(user, ["password"]);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
    async session({ token }) {
      return { ...token };
    },
    async jwt(x) {
      let { token, user, account, trigger, session } = x;
      if (account) {
        token.accessToken = account.access_token;
      }
      if (trigger == "update") {
        token = { ...token, ...session };
      }
      if (user) {
        token = { ...token, ...user };
      }

      try {
        const find = await prisma.user.findFirst({
          where: { email: token.email },
        });
        if (!find) return null;
        return { ...token, role: find.role, name: find.name, username: find.username };
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: "eveer-passport.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1 * 60 * 60 * 24 * 30, // satu bulan
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
