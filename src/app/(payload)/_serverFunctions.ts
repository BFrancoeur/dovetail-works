'use server'

import type { ServerFunctionArgs } from 'payload'
import { handleServerFunctions as _handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import config from '../../payload.config'

export async function handleServerFunctions(args: ServerFunctionArgs) {
  return _handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
