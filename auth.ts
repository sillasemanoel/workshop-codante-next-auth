import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/nodemailer";
import db from "./lib/db";
import { compareSync } from "bcrypt-ts";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User & {
      githubProfile: any;
    };
  }
}

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // se eu quiser salvar a sessao como jwt e nao no db
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@exemplo.com.br",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = compareSync(password, user.password ?? "");
        if (!passwordMatch) {
          return null;
        }

        return user;
      },
    }),
    GithubProvider({
      // pra permitir que eu se concte a uma conta com o email existente
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      return { githubProfile: profile, ...token };
    },

    async session({ session, token }) {
      session.user.githubProfile = token.githubProfile;
      return session;
    },
  },
});
