import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import ClientWrapper from "../components/ClientWrapper";
import WhatsAppButton from "../components/WhatsAppButton";
import FloatingBackButton from "../components/FloatingBackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Staycold — Termos y Botellas Premium",
    template: "%s | Staycold",
  },
  description:
    "Descubre la colección Staycold de termos y botellas premium. Mantén tus bebidas frías 24h o calientes 12h. Deportivos, para oficina y niños. Envíos a todo el país.",
  keywords: ["termos", "botellas de agua", "pachones", "termo deportivo", "staycold", "termos premium"],
  authors: [{ name: "Staycold" }],
  creator: "Staycold",
  openGraph: {
    type: "website",
    locale: "es_GT",
    siteName: "Staycold",
    title: "Staycold — Termos y Botellas Premium",
    description: "Termos y botellas de alta calidad. Frío 24h, calor 12h. Envíos a todo el país.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Staycold — Termos y Botellas Premium",
    description: "Termos y botellas de alta calidad. Frío 24h, calor 12h.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientWrapper>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <FloatingBackButton />
          <WhatsAppButton />
        </ClientWrapper>
      </body>
    </html>
  );
}
