/**
 * Signing JSON Web Signature (JWS) in General JSON Serialization
 *
 * @module
 *
 * @see {@link https://www.rfc-editor.org/info/rfc7515/#section-7.2.1 RFC 7515, Section 7.2.1}
 */

import type * as types from '../../types.d.ts'
import { createSignature } from '../../lib/jws_sign.js'
import type { SignInput } from '../../lib/jws_sign.js'
import { JWSInvalid } from '../../util/errors.js'
import { assertNotSet, assertUint8Array } from '../../lib/validate.js'

/** Configures an individual JWS Signature (digital signature or MAC) in a General JWS. */
export interface Signature {
  /**
   * Sets the JWS Protected Header. May only be called once.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): Signature

  /**
   * Sets the JWS Unprotected Header. May only be called once.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): Signature

  /**
   * Adds another signature to the enclosing {@link GeneralSign} and returns its configuration.
   *
   * @param key Private key or shared secret. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(key: types.KeyInput, options?: types.SignOptions): Signature

  /** Computes all JWS Signatures on the enclosing {@link GeneralSign}, using their configured keys. */
  sign(): Promise<types.GeneralJWS>

  /** Returns the enclosing {@link GeneralSign} instance. */
  done(): GeneralSign
}

type SignatureState = [
  protectedHeader: types.JWSHeaderParameters | undefined,
  unprotectedHeader: types.JWSHeaderParameters | undefined,
  key: types.KeyInput,
  crit: types.SignOptions['crit'],
]

class IndividualSignature implements Signature {
  #parent: GeneralSign

  state: SignatureState

  constructor(sig: GeneralSign, key: types.KeyInput, options?: types.SignOptions) {
    this.#parent = sig
    this.state = [undefined, undefined, key, options?.crit]
  }

  setProtectedHeader(protectedHeader: types.JWSHeaderParameters) {
    assertNotSet(this.state[0], 'setProtectedHeader')
    this.state[0] = protectedHeader
    return this
  }

  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters) {
    assertNotSet(this.state[1], 'setUnprotectedHeader')
    this.state[1] = unprotectedHeader
    return this
  }

  addSignature(...args: Parameters<GeneralSign['addSignature']>) {
    return this.#parent.addSignature(...args)
  }

  sign(...args: Parameters<GeneralSign['sign']>) {
    return this.#parent.sign(...args)
  }

  done() {
    return this.#parent
  }
}

/**
 * Produces general JWS JSON Serialization using digital signatures or MACs.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/general/sign'`.
 *
 * @example
 *
 * ```js
 * const jws = await new jose.GeneralSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .addSignature(ecPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .addSignature(rsaPrivateKey)
 *   .setProtectedHeader({ alg: 'PS256' })
 *   .sign()
 *
 * console.log(jws)
 * ```
 */
export class GeneralSign {
  #payload: Uint8Array

  #signatures: IndividualSignature[] = []

  /**
   * Creates a signer for general JWS JSON Serialization.
   *
   * @param payload JWS Payload bytes to sign or MAC.
   */
  constructor(payload: Uint8Array) {
    this.#payload = payload
  }

  /**
   * Adds a signature and returns its configuration.
   *
   * @param key Private key or shared secret. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(key: types.KeyInput, options?: types.SignOptions): Signature {
    const signature = new IndividualSignature(this, key, options)
    this.#signatures.push(signature)
    return signature
  }

  /**
   * Computes each JWS Signature (digital signature or MAC) and returns the general JWS JSON
   * Serialization.
   */
  async sign(): Promise<types.GeneralJWS> {
    if (!this.#signatures.length) {
      throw new JWSInvalid('at least one signature must be added')
    }

    assertUint8Array(this.#payload, 'payload')

    const jws: types.GeneralJWS = {
      signatures: [],
      payload: '',
    }

    const encodedPayloadCache: NonNullable<SignInput[4]> = []
    let b64: boolean | undefined

    for (const signature of this.#signatures) {
      const [protectedHeader, unprotectedHeader, key, crit] = signature.state

      const [{ payload, ...signatureMembers }, signatureB64] = await createSignature(
        [this.#payload, protectedHeader, unprotectedHeader, crit, encodedPayloadCache],
        key,
      )

      // RFC 7797, Section 3: every signature must use the same b64 value.
      if (b64 === undefined) {
        b64 = signatureB64
        jws.payload = payload
      } else if (b64 !== signatureB64) {
        throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)')
      }
      jws.signatures.push(signatureMembers)
    }

    return jws
  }
}
