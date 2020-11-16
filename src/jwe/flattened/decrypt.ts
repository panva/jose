import { JOSEAlgNotAllowed, JOSENotSupported, JWEInvalid } from '../../util/errors.js'
import isDisjoint from '../../lib/is_disjoint.js'
import isObject from '../../lib/is_object.js'

import { decode as base64url } from '../../runtime/base64url.js'
import decrypt from '../../runtime/decrypt.js'
import { inflate } from '../../runtime/zlib.js'
import decryptKeyManagement from '../../lib/decrypt_key_management.js'

import type {
  FlattenedDecryptResult,
  KeyLike,
  FlattenedJWE,
  JWEHeaderParameters,
  DecryptOptions,
  GetKeyFunction,
} from '../../types.d'
import { encoder, decoder, concat } from '../../lib/buffer_utils.js'
import cekFactory from '../../lib/cek.js'
import random from '../../runtime/random.js'
import validateCrit from '../../lib/validate_crit.js'
import validateAlgorithms from '../../lib/validate_algorithms.js'

const generateCek = cekFactory(random)
const checkCrit = validateCrit.bind(undefined, JWEInvalid, new Map())
const checkAlgOption = validateAlgorithms.bind(undefined, 'keyManagementAlgorithms')
const checkEncOption = validateAlgorithms.bind(undefined, 'contentEncryptionAlgorithms')

/**
 * Interface for Flattened JWE Decryption dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface FlattenedDecryptGetKey
  extends GetKeyFunction<JWEHeaderParameters | undefined, FlattenedJWE> {}

/**
 * Decrypts a Flattened JWE.
 *
 * @param jwe Flattened JWE.
 * @param key Public Key or Secret, or a function resolving one, to decrypt the JWE with.
 * @param options JWE Decryption options.
 *
 * @example
 * ```
 * // ESM import
 * import flattenedDecrypt from 'jose/jwe/flattened/decrypt'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: flattenedDecrypt } = require('jose/jwe/flattened/decrypt')
 * ```
 *
 * @example
 * ```
 * // usage
 * import parseJwk from 'jose/jwk/parse'
 *
 * const decoder = new TextDecoder()
 * const jwe = {
 *   ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
 *   iv: '8Fy7A_IuoX5VXG9s',
 *   tag: 'W76IYV6arGRuDSaSyWrQNg',
 *   encrypted_key: 'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
 *   aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
 *   protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0'
 * }
 * const privateKey = await parseJwk({
 *   e: 'AQAB',
 *   n: 'qpzYkTGRKSUcd12hZaJnYEKVLfdEsqu6HBAxZgRSvzLFj_zTSAEXjbf3fX47MPEHRw8NDcEXPjVOz84t4FTXYF2w2_LGWfp_myjV8pR6oUUncJjS7DhnUmTG5bpuK2HFXRMRJYz_iNR48xRJPMoY84jrnhdIFx8Tqv6w4ZHVyEvcvloPgwG3UjLidP6jmqbTiJtidVLnpQJRuFNFQJiluQXBZ1nOLC7raQshu7L9y0IatVU7vf0BPnmuSkcNNvmQkSta6ODQBPaL5-o5SW8H37vQjPDkrlJpreViNa3jqP5DB5HYUO-DMh4FegRv9gZWLDEvXpSd9A13YXCa9Q8K_w',
 *   d: 'YAfYfiEAK8CPvUAeUC6RMUVI4o6DRG4UWydiJqHYUXYqbVlJMwYqU8Jws1oRxwJjrkNyfYNpqcInkh_jApm-gKc7nRGRQ6QTnynlAp1ASPW7tUzPq9YzkdTXfwboa9KkXDcXN6OdUU8GpQuODYFTegBfXqSMFzeOwniI5u5G_m2I6YU1zU4x7dxaKhPSK2mJ1v-tJu88j855DYIY0AiX5uf_oa0CgaqyOOY3LaxGjV0FxrkAzYluHfQef7ux-1ocXD1aUrdj3owk48ZVEb2o-V1bMLtk415ngS-u89bABHuJ50-gIwpO-y7ofe6ik4fAd9NfD8PVKHHsrNYbC5FdAQ',
 *   p: '4WlvPw4Vf-mHzoqem_2VUf7hMiLEM5sl_th-CZyA0dowhEnNBJPtaqCz2k_6_ECKZ5C-KoT-EmQOBILQFJtR9SOs6fI9yZGL1OpbjGNKpWzym8iQrFcKAhFvQ_hG7Fkwz6_yRV5fKnOWSD78Rk6wuOTaXqwJS7uljvrn7SmRFpE',
 *   q: 'wcO_PHrkHazbqDgBVvTDaMXJ7W5l0RTxhrOsU6qGCLp367Zc2F9BwPAlMy9KKMhf9RLxgv32lGqWxVh3WQ1GSJqswSIKhfAOzmuTDjlYxqrte_TMcaVDxtRuO8Bxp5A8Y7i3VxQ_Rjfa04QLxJfiRdap4UamYWco25WKH4rkcI8',
 *   dp: 'rWynEIZPeEg-GmSAP1fMqHdG34HsHiBCDV6XKeHlIo-SQFVfjSQax6y4c0CRw74MPj4YcTI9H_0m48WZPiF53vcBtESR0SFPyhI9OTezWK8HwV-AH3gf1ROA3XSJbJH6ge_GoCRJZ6nid9ct1RH52WcJs0j9Je1LJURZaBhQ7mE',
 *   dq: 'tYrMc0ME1dTuHQcUIj_Dkje2gLGtzZ6cyMMw01byq9zhnMRI6yUcu0OE5xcImXtbhIfSJhQCYn4XcyD2-UWZs07QS0e0qlcH2Fkr9-i9B66AQWJT5qqb_P9tpKgjFIbsPdaEWJ8MxaJxcTnHuNNBWoPMuNfz7VC1FD9goTsF23s',
 *   qi: 'qAZmEWhWcDgW_pQZA5e7r185-sOnNPAW53y16QKh5wNThGjpUl7OvePZWY59ekd6PYwvkloNIRki6mLskP9NZ73CsAdZknSAPaAmBuNGYDabtObcigQDPFQ5DeqyAdRUrim66eN7whE5mf_XgOwVAx3-9PtfHvvmTTNezHfoZdo',
 *   kty: 'RSA'
 * }, 'RSA-OAEP-256')
 *
 * const {
 *   plaintext,
 *   protectedHeader,
 *   additionalAuthenticatedData
 * } = await flattenedDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(plaintext))
 * console.log(decoder.decode(additionalAuthenticatedData))
 * ```
 */
export default async function flattenedDecrypt(
  jwe: FlattenedJWE,
  key: KeyLike | FlattenedDecryptGetKey,
  options?: DecryptOptions,
): Promise<FlattenedDecryptResult> {
  if (!isObject(jwe)) {
    throw new JWEInvalid('Flattened JWE must be an object')
  }

  if (jwe.protected === undefined && jwe.header === undefined && jwe.unprotected === undefined) {
    throw new JWEInvalid('JOSE Header missing')
  }

  if (typeof jwe.iv !== 'string') {
    throw new JWEInvalid('JWE Initialization Vector missing or incorrect type')
  }

  if (typeof jwe.ciphertext !== 'string') {
    throw new JWEInvalid('JWE Ciphertext missing or incorrect type')
  }

  if (typeof jwe.tag !== 'string') {
    throw new JWEInvalid('JWE Authentication Tag missing or incorrect type')
  }

  if (jwe.protected !== undefined && typeof jwe.protected !== 'string') {
    throw new JWEInvalid('JWE Protected Header incorrect type')
  }

  if (jwe.encrypted_key !== undefined && typeof jwe.encrypted_key !== 'string') {
    throw new JWEInvalid('JWE Encrypted Key incorrect type')
  }

  if (jwe.aad !== undefined && typeof jwe.aad !== 'string') {
    throw new JWEInvalid('JWE AAD incorrect type')
  }

  if (jwe.header !== undefined && !isObject(jwe.header)) {
    throw new JWEInvalid('JWE Shared Unprotected Header incorrect type')
  }

  if (jwe.unprotected !== undefined && !isObject(jwe.unprotected)) {
    throw new JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type')
  }

  let parsedProt!: JWEHeaderParameters
  if (jwe.protected) {
    const protectedHeader = base64url(jwe.protected)
    parsedProt = JSON.parse(decoder.decode(protectedHeader))
  }
  if (!isDisjoint(parsedProt, jwe.header, jwe.unprotected)) {
    throw new JWEInvalid(
      'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint',
    )
  }

  const joseHeader: JWEHeaderParameters = {
    ...parsedProt,
    ...jwe.header,
    ...jwe.unprotected,
  }

  checkCrit(parsedProt, joseHeader)

  if (joseHeader.zip !== undefined) {
    if (!parsedProt || !parsedProt.zip) {
      throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected')
    }

    if (joseHeader.zip !== 'DEF') {
      throw new JOSENotSupported(
        'unsupported JWE "zip" (Compression Algorithm) Header Parameter value',
      )
    }
  }

  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('missing JWE Algorithm (alg) in JWE Header')
  }

  if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header')
  }

  const keyManagementAlgorithms = options && checkAlgOption(options.keyManagementAlgorithms)
  const contentEncryptionAlgorithms = options && checkEncOption(options.contentEncryptionAlgorithms)

  if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed')
  }

  if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
    throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter not allowed')
  }

  let encryptedKey!: Uint8Array
  if (jwe.encrypted_key !== undefined) {
    encryptedKey = base64url(jwe.encrypted_key!)
  }

  if (typeof key === 'function') {
    // eslint-disable-next-line no-param-reassign
    key = await key(parsedProt, jwe)
  }

  let cek: KeyLike
  try {
    cek = await decryptKeyManagement(alg, key, encryptedKey, joseHeader)
  } catch (err) {
    if (err instanceof TypeError) {
      throw err
    }
    // https://tools.ietf.org/html/rfc7516#section-11.5
    // To mitigate the attacks described in RFC 3218, the
    // recipient MUST NOT distinguish between format, padding, and length
    // errors of encrypted keys.  It is strongly recommended, in the event
    // of receiving an improperly formatted key, that the recipient
    // substitute a randomly generated CEK and proceed to the next step, to
    // mitigate timing attacks.
    cek = await generateCek(enc)
  }

  const iv = base64url(jwe.iv)
  const tag = base64url(jwe.tag)

  const protectedHeader: Uint8Array = encoder.encode(jwe.protected || '')
  let additionalData: Uint8Array

  if (jwe.aad !== undefined) {
    additionalData = concat(protectedHeader, encoder.encode('.'), encoder.encode(jwe.aad))
  } else {
    additionalData = protectedHeader
  }

  let plaintext = await decrypt(enc, cek, base64url(jwe.ciphertext), iv, tag, additionalData)

  if (joseHeader.zip === 'DEF') {
    plaintext = await (options?.inflateRaw || inflate)(plaintext)
  }

  const result: FlattenedDecryptResult = { plaintext }

  if (jwe.protected !== undefined) {
    result.protectedHeader = parsedProt
  }

  if (jwe.aad !== undefined) {
    result.additionalAuthenticatedData = base64url(jwe.aad!)
  }

  if (jwe.unprotected !== undefined) {
    result.sharedUnprotectedHeader = jwe.unprotected
  }

  if (jwe.header !== undefined) {
    result.unprotectedHeader = jwe.header
  }

  return result
}

export type { KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions }
