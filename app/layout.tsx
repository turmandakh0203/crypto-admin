import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Crypto Admin",
  description: "Crypto News Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={spaceGrotesk.variable}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
