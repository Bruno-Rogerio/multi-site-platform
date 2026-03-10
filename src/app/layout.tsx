import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${ROOT}`),
  title: {
    default: "BuildSphere — Crie seu site profissional em minutos",
    template: "%s | BuildSphere",
  },
  description:
    "Crie seu site profissional em menos de 5 minutos. Planos a partir de R$ 59,90/mês para psicólogos, coaches, consultores e autônomos. Sem código, sem complicação.",
  keywords: [
    "criar site profissional",
    "site para psicólogo",
    "site para coach",
    "site para autônomo",
    "construtor de sites",
    "plataforma de sites",
    "site profissional barato",
    "criar site sem código",
    "presença online profissional",
    "site para pequenas empresas",
  ],
  authors: [{ name: "BuildSphere", url: `https://${ROOT}` }],
  creator: "BuildSphere",
  publisher: "BuildSphere",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `https://${ROOT}`,
    siteName: "BuildSphere",
    title: "BuildSphere — Crie seu site profissional em minutos",
    description:
      "Crie seu site profissional em menos de 5 minutos. Planos a partir de R$ 59,90/mês para psicólogos, coaches, consultores e autônomos.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildSphere — Plataforma de sites profissionais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildSphere — Crie seu site profissional em minutos",
    description:
      "Crie seu site profissional em menos de 5 minutos. Planos a partir de R$ 59,90/mês. Sem código, sem complicação.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `https://${ROOT}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${sora.variable} antialiased`}>{children}</body>
    </html>
  );
}
