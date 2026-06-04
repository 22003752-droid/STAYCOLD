# 🧊 Staycold — E-Commerce Platform

Tienda en línea de termos y botellas premium. Construida con **Next.js 14**, **TailwindCSS**, y autenticación segura via **NextAuth.js**.

---

## 🚀 Deploy en Vercel (Paso a Paso)

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit — Staycold store"
git remote add origin https://github.com/TU_USUARIO/staycold.git
git push -u origin main
```

### 2. Crear cuenta y conectar en Vercel

1. Ve a [vercel.com](https://vercel.com) → **Sign Up** con tu cuenta de GitHub
2. Click en **"Add New Project"**
3. Selecciona el repositorio `staycold`
4. Vercel detecta automáticamente que es Next.js ✅

### 3. Configurar Variables de Entorno en Vercel

En el panel de Vercel, antes de hacer Deploy, agrega estas variables:

| Variable | Valor |
|---|---|
| `NEXTAUTH_SECRET` | (genera con: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` |
| `ADMIN_EMAIL` | tu email de admin |
| `ADMIN_PASSWORD` | contraseña segura |

### 4. Deploy

Click en **"Deploy"** — Vercel construye y publica el sitio automáticamente.

---

## 🗄️ Base de Datos en Producción

Actualmente el proyecto usa un archivo JSON local (`src/lib/db.json`). En producción esto **no funciona** en Vercel ya que el filesystem es de solo lectura.

### Opción Recomendada: PlanetScale (MySQL gratuito)

1. Crea cuenta en [planetscale.com](https://planetscale.com)
2. Crea una base de datos llamada `staycold`
3. Importa el `schema.sql`
4. Copia las credenciales de conexión
5. Agrega a las variables de entorno de Vercel:

```
DB_HOST=aws.connect.psdb.cloud
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña_planetscale
DB_NAME=staycold
```

6. Actualiza `src/lib/db.ts` para usar estas variables (ya está preparado)

---

## 🔐 Autenticación Admin

### Credenciales iniciales (cambiar después del primer login)

- **Email:** definido en `ADMIN_EMAIL` (.env.local)
- **Contraseña:** definida en `ADMIN_PASSWORD` (.env.local)

El primer admin se crea automáticamente al iniciar el servidor si no existe ninguno.

### Seguridad implementada

- ✅ Contraseñas hasheadas con **bcrypt** (salt rounds: 12)
- ✅ Sesiones con **JWT** firmados con secreto del servidor
- ✅ Cookies `HttpOnly` (no accesibles desde JavaScript)
- ✅ Sesión expira en **8 horas**
- ✅ Middleware protege todas las rutas `/admin/*`

---

## 📦 Inventario en Tiempo Real

Los cambios de stock se propagan instantáneamente a todos los dispositivos conectados via **Server-Sent Events (SSE)**.

- Endpoint: `GET /api/inventory/stream`
- Hook React: `useInventoryStream` en `src/hooks/useInventoryStream.ts`
- Reconexión automática si se pierde la conexión

---

## 🌐 Dominio Personalizado

1. Compra un dominio en [Namecheap](https://namecheap.com) (~$12/año)
2. En Vercel: **Settings → Domains → Add Domain**
3. Sigue las instrucciones para configurar DNS
4. Actualiza `NEXTAUTH_URL` con tu dominio real

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)
Panel admin en [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📁 Estructura del Proyecto

```
staycold/
├── src/
│   ├── app/
│   │   ├── admin/           # Panel de administración
│   │   ├── api/             # API Routes (Next.js)
│   │   │   ├── auth/        # NextAuth handler
│   │   │   ├── products/    # CRUD productos + SSE events
│   │   │   └── inventory/   # Stream SSE tiempo real
│   │   ├── catalog/         # Catálogo público
│   │   └── checkout/        # Proceso de compra
│   ├── components/          # Componentes React
│   ├── hooks/               # Custom hooks (useInventoryStream)
│   ├── lib/
│   │   ├── auth.ts          # Config NextAuth
│   │   ├── db.ts            # Conexión MySQL
│   │   ├── db.json          # DB local (solo desarrollo)
│   │   └── eventEmitter.ts  # SSE event bus
│   └── store/               # Estado global (Zustand)
├── public/
│   └── robots.txt           # SEO
├── schema.sql               # Esquema MySQL para producción
└── .env.local               # Variables de entorno (NO subir a Git)
```
