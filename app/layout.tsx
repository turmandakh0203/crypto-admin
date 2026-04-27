import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import DashboardLayout from '@/components/DashboardLayout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-tt-norms-pro',
})

const ttNormsPro = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-tt-norms-pro",
});

export const metadata: Metadata = {
  title: 'Crypto Admin',
  description: 'Crypto News Admin Panel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={ttNormsPro.variable}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  )
}
