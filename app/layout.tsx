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
  title: "Julieth & Mateo — Save the Date",
  description:
    "03 . 10 . 2026 — Acompáñanos a celebrar el día que dijimos sí para siempre.",
  openGraph: {
    title: "Julieth & Mateo — Save the Date",
    description: "03 . 10 . 2026",
    type: "website",
  },
};

// Tints the mobile browser address bar / app tab chrome to match the cream
// gradient at the top of the page, so the browser UI blends seamlessly with
// the invitation background.
export const viewport: Viewport = {
  themeColor: "#fbfaf5",
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
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
