import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
