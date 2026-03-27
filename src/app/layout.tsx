import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1020",
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://${ROOT}`),
  title: {
    default: "Crie seu site profissional sem código — BuildSphere",
    template: "%s | BuildSphere",
  },
  description:
    "O criador de site profissional mais fácil do Brasil. Sem código, sem taxa de setup, sem programador. Para autônomos, MEIs, psicólogos, coaches e nutricionistas. A partir de R$ 29,90/mês.",
  keywords: [
    "criar site profissional",
    "criador de site profissional",
    "site para autônomo",
    "site para MEI",
    "construtor de sites Brasil",
    "criar site sem programador",
    "site para fotógrafo",
    "site para personal trainer",
    "site para nutricionista",
    "site para advogado",
    "plataforma de sites",
    "criar site grátis",
    "site profissional barato",
    "criador de site para autônomo",
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
    title: "Crie seu site profissional sem código — BuildSphere",
    description:
      "O criador de site profissional mais fácil do Brasil. Sem código, sem taxa de setup. Para autônomos, MEIs, psicólogos, coaches e nutricionistas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildSphere — Criador de site profissional para autônomos e MEIs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crie seu site profissional sem código — BuildSphere",
    description:
      "O criador de site mais fácil do Brasil. Sem código, sem taxa de setup. Para autônomos, MEIs e prestadores de serviço. A partir de R$ 29,90/mês.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `https://${ROOT}`,
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `https://${ROOT}/#organization`,
  name: "BuildSphere",
  url: `https://${ROOT}`,
  logo: {
    "@type": "ImageObject",
    url: `https://${ROOT}/og-image.png`,
    width: 1200,
    height: 630,
  },
  description:
    "BuildSphere é o criador de site profissional para autônomos e MEIs. Psicólogos, coaches, nutricionistas, fotógrafos e personal trainers criam sites sem código em menos de 5 minutos.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-11-91519-4173",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={`${sora.variable} antialiased`}>
        {children}

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1502490504736223');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1502490504736223&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
