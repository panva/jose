import { get as http } from 'http'
import { get as https } from 'https'
import { once } from 'events'
import type { ClientRequest, IncomingMessage } from 'http'
import type { RequestOptions } from 'https'

import type { FetchFunction } from '../interfaces'
import { JOSEError } from '../../util/errors.js'
import { concat, decoder } from '../../lib/buffer_utils.js'

const protocols: { [protocol: string]: (...args: Parameters<typeof https>) => ClientRequest } = {
  'https:': https,
  'http:': http,
}

type AcceptedRequestOptions = Pick<RequestOptions, 'agent'>

const fetchJwks: FetchFunction = async (
  url: URL,
  timeout: number,
  options: AcceptedRequestOptions,
) => {
  if (protocols[url.protocol] === undefined) {
    throw new TypeError('Unsupported URL protocol.')
  }

  const { agent } = options
  const req = protocols[url.protocol](url.href, {
    agent,
    timeout,
  })

  // eslint-disable-next-line @typescript-eslint/keyword-spacing
  const [response] = <[IncomingMessage]>await once(req, 'response')

  if (response.statusCode !== 200) {
    throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response')
  }

  const parts = []
  // eslint-disable-next-line no-restricted-syntax
  for await (const part of response) {
    parts.push(part)
  }

  try {
    return JSON.parse(decoder.decode(concat(...parts)))
  } catch (err) {
    throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON')
  }
}

export default fetchJwks
