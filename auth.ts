import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          const user = await prisma.usuario.findUnique({
            where: { username },
          });
          
          if (!user) return null;

          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id,
              username: user.username,
              name: user.nombre, // mapear para session.user.name
              nivel: user.nivel,
            };
          }
        }

        console.log("Credenciales inválidas");
        return null;
      },
    }),
  ],
});
