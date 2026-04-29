import type { Metadata } from 'next'
import { Lora, Open_Sans } from 'next/font/google'
import '@/styles/globals.css'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dovetail Works',
  description: 'High-quality, ready-to-purchase leads and hands-free website management for home remodeling businesses.',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
