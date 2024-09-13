import { Buffer } from 'node:buffer'
import { decoder } from '../../lib/buffer_utils.js'

function normalize(input: string | Uint8Array) {
  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  return encoded
}

const encode = (input: Uint8Array | string) => Buffer.from(input).toString('base64url')

export const decodeBase64 = (input: string) => new Uint8Array(Buffer.from(input, 'base64'))
export const encodeBase64 = (input: Uint8Array | string) => Buffer.from(input).toString('base64')
export { encode }
export const decode = (input: Uint8Array | string) =>
  new Uint8Array(Buffer.from(normalize(input), 'base64url'))
