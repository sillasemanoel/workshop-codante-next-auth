import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./lib/db";
import { compareSync } from "bcrypt-ts";

export const {
  handlers: { GET, POST },
  signIn,
  auth,
} = NextAuth({
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

        const matches = compareSync(password, user.password ?? "");

        if (matches) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      },
    }),
  ],
});
