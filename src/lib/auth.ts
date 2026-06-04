import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// ─── Leer la DB local (JSON file) ───────────────────────────────────────────
const dbPath = path.join(process.cwd(), 'src/lib/db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return { products: [], categories: [], brands: [], settings: {}, admins: [] };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

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

        // 2. Si no es el admin de entorno, buscar en db.json (solo lectura para evitar errores en Vercel)
        try {
          const db = readDB();
          const admins = db.admins || [];

          const admin = admins.find(
            (a: any) => a.email.toLowerCase() === credentials.email.toLowerCase()
          );

          if (admin) {
            const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
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
          console.error("Error al leer admins:", error);
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
