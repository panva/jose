import type { FetchFunction } from '../interfaces.d'
import { JOSEError } from '../../util/errors.js'
import globalThis from './global.js'

function createAbortSignal(ms?: number) {
  if (typeof (AbortController as unknown) !== 'function') { return }
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

const isCloudflareWorker = ("mode" in new Request(""))

const fetchJwks: FetchFunction = async (url: URL, timeout: number) => {
  const signal = createAbortSignal(timeout)
  const referrerPolicy = !isCloudflareWorker ? 'no-referrer' : undefined
  const credentials =    !isCloudflareWorker ? 'omit' : undefined
  const mode =           !isCloudflareWorker ? 'cors' : undefined

  const response = await globalThis.fetch(url.href, {
    redirect: 'manual',
    method: 'GET',
    signal,
    referrerPolicy,
    credentials,
    mode,
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
