import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    reactCompiler: false,
  },
  serverActions: {
    allowedOrigins: [
      'localhost:8080',
      'localhost:8443',
      'localhost:3000',
    ],
  },
}

export default withPayload(nextConfig)
