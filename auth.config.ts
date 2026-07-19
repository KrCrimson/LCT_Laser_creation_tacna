import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = !nextUrl.pathname.startsWith("/login");
      
      if (isOnDashboard) {
        if (!isLoggedIn) return false; // Redirige a /login
        
        // Rutas protegidas solo para administradores (nivel 2)
        const adminOnlyRoutes = ['/materiales', '/complementos', '/gastos', '/usuarios'];
        const isTryingToAccessAdminRoute = adminOnlyRoutes.some(route => nextUrl.pathname.startsWith(route));
        
        if (isTryingToAccessAdminRoute && auth.user?.nivel !== 2) {
          return Response.redirect(new URL("/", nextUrl)); // Redirige al inicio si no es admin
        }
        
        return true;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl)); // Si ya está logueado y va a /login, envíalo al dashboard
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.nivel = user.nivel;
        token.id = user.id as string;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.nivel = token.nivel as number;
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  providers: [], // Añadiremos providers en auth.ts
} satisfies NextAuthConfig;
