import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import { handleServerFunctions } from './_serverFunctions'
import React from 'react'

const configPromise = import('../../payload.config').then((m) => m.default)

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={handleServerFunctions}
    >
      {children}
    </RootLayout>
  )
}
