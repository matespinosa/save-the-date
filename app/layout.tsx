import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Italianno } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const italianno = Italianno({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mateo & Julieth — Save the Date",
  description: "Save the Date — 03.10.2026 · Bogotá, Colombia",
  openGraph: {
    title: "Mateo & Julieth — Save the Date",
    description: "03.10.2026 · Bogotá, Colombia",
    type: "website",
    locale: "es_CO",
    siteName: "Mateo & Julieth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mateo & Julieth — Save the Date",
    description: "03.10.2026 · Bogotá, Colombia",
  },
};

// Tints the mobile browser chrome (top status bar / bottom URL bar in Safari
// iOS) to match the cream gradient. We pick the BOTTOM stop of the gradient
// (#e6e3d2) instead of the top (#fbfaf5) because the previous near-white value
// was being rendered as plain white by Safari, especially around the bottom
// URL bar where iOS samples adaptively.
export const viewport: Viewport = {
  themeColor: "#e6e3d2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${inter.variable} ${italianno.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col text-ink"
        style={{ backgroundColor: "#e6e3d2" }}
      >
        {children}
      </body>
    </html>
  );
}
