import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wadud — Healthcare Telemedicine Platform",
    template: "%s | Wadud",
  },
  description:
    "Connect with certified doctors online. Book video or chat consultations, manage your health records, and get expert care from anywhere.",
  keywords: ["telemedicine", "online doctor", "healthcare", "consultation", "Pakistan", "UAE"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wadud.app",
    siteName: "Wadud",
    title: "Wadud — Healthcare Telemedicine Platform",
    description: "Expert healthcare at your fingertips",
  },
  twitter: { card: "summary_large_image", title: "Wadud", description: "Expert healthcare at your fingertips" },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  metadataBase: new URL("https://wadud.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
