import { encoder, decoder } from '../../lib/buffer_utils.js'
import globalThis from './global.js'

export const encode = (input: Uint8Array | string) => {
  let unencoded = input
  if (typeof unencoded === 'string') {
    unencoded = encoder.encode(unencoded)
  }
  const base64string = globalThis.btoa(String.fromCharCode.apply(0, [...unencoded]))
  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export const decode = (input: Uint8Array | string) => {
  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
  return new Uint8Array(
    globalThis
      .atob(encoded)
      .split('')
      .map((c) => c.charCodeAt(0)),
  )
}
