import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dovetail Works',
  description: 'Powered by Next.js and Payload CMS',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
