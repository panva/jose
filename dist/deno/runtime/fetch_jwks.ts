import type { FetchFunction } from './interfaces.d.ts'
import { JOSEError } from '../util/errors.ts'
import globalThis from './global.ts'

const fetchJwks: FetchFunction = async (url: URL, timeout: number) => {
  let controller!: AbortController
  if (typeof AbortController === 'function') {
    controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)
  }

  const response = await globalThis.fetch(url.href, {
    signal: controller ? controller.signal : undefined,
    redirect: 'manual',
    method: 'GET',
    // do not pass referrerPolicy, credentials, and mode when running
    // in Cloudflare Workers environment
    // @ts-expect-error
    ...(typeof globalThis.WebSocketPair === 'undefined'
      ? {
          referrerPolicy: 'no-referrer',
          credentials: 'omit',
          mode: 'cors',
        }
      : undefined),
  })

  if (response.status !== 200) {
    throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response')
  }

  try {
    return await response.json()
  } catch {
    throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON')
  }
}
export default fetchJwks
