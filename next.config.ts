import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    reactCompiler: false,
    serverActions: {
      allowedOrigins: ['localhost:8080', 'localhost:8443', 'localhost:3000'],
    },
  },
  // Polling required for HMR inside Docker on Windows (inotify doesn't work through WSL2 bind mounts)
  webpack: (config, { dev }) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    }
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default withPayload(nextConfig)
