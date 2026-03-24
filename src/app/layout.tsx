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
    default: "BuildSphere — Criador de site profissional para autônomos",
    template: "%s | BuildSphere",
  },
  description:
    "O criador de site profissional mais fácil do Brasil. Crie seu site em menos de 5 minutos sem código e sem taxa de setup. Para psicólogos, coaches, consultores e autônomos. A partir de R$ 59,90/mês.",
  keywords: [
    "criador de site",
    "criador de site profissional",
    "criar site profissional",
    "criador de site para autônomo",
    "criar site sem código",
    "site para psicólogo",
    "site para coach",
    "site para nutricionista",
    "site para autônomo",
    "construtor de sites",
    "site profissional barato",
    "presença online profissional",
    "site para pequenas empresas",
    "criar site grátis",
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
    title: "BuildSphere — Criador de site profissional para autônomos",
    description:
      "O criador de site mais fácil do Brasil. Crie seu site profissional em menos de 5 minutos, sem código e sem taxa de setup. A partir de R$ 59,90/mês.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildSphere — Criador de site profissional para autônomos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildSphere — Criador de site profissional para autônomos",
    description:
      "O criador de site mais fácil do Brasil. Crie seu site em menos de 5 minutos, sem código e sem taxa de setup. A partir de R$ 59,90/mês.",
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
