import type { FetchFunction } from '../interfaces.d'
import { JOSEError } from '../../util/errors.js'
import globalThis from './global.js'

function createAbortSignal(ms?: number) {
  if (typeof (AbortController as unknown) !== 'function') { return }
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

const hasMode = ("mode" in new Request(""))
const hasCredentials = ("credentials" in new Request(""))
const hasReferrerPolicy = ("referrerPolicy" in new Request(""))

const fetchJwks: FetchFunction = async (url: URL, timeout: number) => {
  const signal = createAbortSignal(timeout)

  const response = await globalThis.fetch(url.href, {
    signal,
    redirect: 'manual',
    method: 'GET',
    referrerPolicy: hasReferrerPolicy ? 'no-referrer' : undefined,
    credentials: hasCredentials ? 'omit' : undefined,
    mode: hasMode ? 'cors' : undefined,
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
