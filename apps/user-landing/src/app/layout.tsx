import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GymFit - Transform Your Body & Mind',
  description: 'Join GymFit for world-class training, expert trainers, and state-of-the-art facilities. Start your fitness journey today.',
  keywords: 'gym, fitness, training, workout, health, exercise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
