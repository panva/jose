import { once } from 'events'
import type { ClientRequest, IncomingMessage } from 'http'
import * as http from 'http'
import type { RequestOptions } from 'https'
import * as https from 'https'
import { concat, decoder } from '../../lib/buffer_utils.js'
import { JOSEError, JWKSTimeout } from '../../util/errors.js'
import type { FetchFunction } from '../interfaces.d'

type AcceptedRequestOptions = Pick<RequestOptions, 'agent' | 'headers'>

const fetchJwks: FetchFunction = async (
  url: URL,
  timeout: number,
  options: AcceptedRequestOptions,
) => {
  let get: (...args: Parameters<typeof https.get>) => ClientRequest
  switch (url.protocol) {
    case 'https:':
      get = https.get
      break
    case 'http:':
      get = http.get
      break
    default:
      throw new TypeError('Unsupported URL protocol.')
  }

  const { agent, headers } = options
  const req = get(url.href, {
    agent,
    timeout,
    headers,
  })

  const [response] = <[IncomingMessage]>(
    await Promise.race([once(req, 'response'), once(req, 'timeout')])
  )

  // timeout reached
  if (!response) {
    req.destroy()
    throw new JWKSTimeout()
  }

  if (response.statusCode !== 200) {
    throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response')
  }

  const parts = []
  for await (const part of response) {
    parts.push(part)
  }

  try {
    return JSON.parse(decoder.decode(concat(...parts)))
  } catch {
    throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON')
  }
}

export default fetchJwks
