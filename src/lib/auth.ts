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

// ─── Inicializar admin por defecto si no existe ninguno ─────────────────────
export async function ensureDefaultAdmin() {
  const db = readDB();
  if (!db.admins) db.admins = [];

  if (db.admins.length === 0) {
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@staycold.com';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'StayCold2024!';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    db.admins.push({
      id: 1,
      email: defaultEmail,
      passwordHash,
      name: 'Administrador',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    writeDB(db);
    console.log(`✅ Admin creado: ${defaultEmail}`);
  }
}

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

        // Asegura que existe al menos un admin
        await ensureDefaultAdmin();

        const db = readDB();
        const admins = db.admins || [];

        const admin = admins.find(
          (a: any) => a.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (!admin) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!isValid) return null;

        return {
          id: String(admin.id),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
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
