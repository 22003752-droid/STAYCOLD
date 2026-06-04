import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

// ─── Configuración NextAuth ──────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Validar primero contra las variables de entorno de Vercel
        const envEmail = process.env.ADMIN_EMAIL || 'admin@staycold.com';
        const envPassword = process.env.ADMIN_PASSWORD || 'StayCold2024!';

        if (
          credentials.email.toLowerCase() === envEmail.toLowerCase() &&
          credentials.password === envPassword
        ) {
          return {
            id: "1",
            email: envEmail,
            name: 'Administrador Principal',
            role: 'admin',
          };
        }

        // 2. Si no es el admin principal, buscar en la tabla admins (MySQL)
        try {
          const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [credentials.email.toLowerCase()]);
          const admin = (rows as any[])[0];

          if (admin) {
            const isValid = await bcrypt.compare(credentials.password, admin.password_hash);
            if (isValid) {
              return {
                id: String(admin.id),
                email: admin.email,
                name: admin.name,
                role: admin.role,
              };
            }
          }
        } catch (error) {
          console.error("Error al buscar admin en MySQL:", error);
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 horas
  },

  secret: process.env.NEXTAUTH_SECRET,
};
