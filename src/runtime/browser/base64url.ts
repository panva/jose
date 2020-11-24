import type { Base64UrlDecode, Base64UrlEncode } from '../interfaces.d'
import { encoder, decoder } from '../../lib/buffer_utils.js'
import { globals } from '../../util/globals';

export const encode: Base64UrlEncode = (input) => {
  let unencoded = input
  if (typeof unencoded === 'string') {
    unencoded = encoder.encode(unencoded)
  }
  const base64string = globals.btoa(String.fromCharCode.apply(0, [...unencoded]))
  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export const decode: Base64UrlDecode = (input) => {
  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
  return new Uint8Array(
    globals
      .atob(encoded)
      .split('')
      .map((c) => c.charCodeAt(0)),
  )
}
