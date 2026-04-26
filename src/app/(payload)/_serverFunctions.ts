'use server'

import type { ServerFunctionArgs } from 'payload'
import { handleServerFunctions as _handleServerFunctions } from '@payloadcms/next/layouts'
import { getPayload } from 'payload'
import config from '../../payload.config'

export async function handleServerFunctions(args: ServerFunctionArgs) {
  await getPayload({ config })
  return _handleServerFunctions(args)
}
