import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// ─── Middleware de Autenticación con NextAuth ────────────────────────────────
// Protege todas las rutas /admin/* excepto /admin/login
// Usa JWT real en lugar de la cookie simple anterior
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;

        // La página de login siempre accesible
        if (path === '/admin/login') return true;

        // Todas las demás rutas /admin/* requieren token válido
        if (path.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: '/admin/:path*',
};
