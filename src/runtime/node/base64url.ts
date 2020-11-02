import type { Base64UrlDecode, Base64UrlEncode } from '../interfaces.d'
import { decoder } from '../../lib/buffer_utils.js'

export const encode: Base64UrlEncode = (input) =>
  Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

export const decode: Base64UrlDecode = (input) => {
  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  return new Uint8Array(Buffer.from(encoded, 'base64'))
}
