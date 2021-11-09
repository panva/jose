import { FlattenedSign } from '../flattened/sign.js'
import { JWSInvalid } from '../../util/errors.js'

import type { KeyLike, GeneralJWS, JWSHeaderParameters, SignOptions } from '../../types.d'

export interface Signature {
  /**
   * Sets the JWS Protected Header on the Signature object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: JWSHeaderParameters): Signature

  /**
   * Sets the JWS Unprotected Header on the Signature object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters): Signature
}

interface SignatureReference {
  protectedHeader?: JWSHeaderParameters
  unprotectedHeader?: JWSHeaderParameters
  options?: SignOptions
  key: KeyLike | Uint8Array
}

const signatureRef: WeakMap<IndividualSignature, SignatureReference> = new WeakMap()

class IndividualSignature implements Signature {
  setProtectedHeader(protectedHeader: JWSHeaderParameters) {
    const ref = signatureRef.get(this)!
    if (ref.protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    ref.protectedHeader = protectedHeader
    return this
  }

  setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters) {
    const ref = signatureRef.get(this)!
    if (ref.unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
    ref.unprotectedHeader = unprotectedHeader
    return this
  }
}

/**
 * The GeneralSign class is a utility for creating General JWS objects.
 *
 * @example Usage
 * ```js
 * const encoder = new TextEncoder()
 *
 * const sign = new GeneralSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
 *
 * sign
 *   .addSignature(ecPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *
 * sign
 *   .addSignature(rsaPrivateKey)
 *   .setProtectedHeader({ alg: 'PS256' })
 *
 * const jws = await sign.sign()
 * ```
 *
 * @example ESM import
 * ```js
 * import { GeneralSign } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { GeneralSign } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { GeneralSign } from 'https://deno.land/x/jose@VERSION/index.ts'
 * ```
 */
export class GeneralSign {
  private _payload: Uint8Array

  private _signatures: IndividualSignature[] = []

  /**
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    this._payload = payload
  }

  /**
   * Adds an additional signature for the General JWS object.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with.
   * @param options JWS Sign options.
   */
  addSignature(key: KeyLike | Uint8Array, options?: SignOptions): Signature {
    const signature = new IndividualSignature()
    signatureRef.set(signature, { key, options })
    this._signatures.push(signature)
    return signature
  }

  /**
   * Signs and resolves the value of the General JWS object.
   */
  async sign(): Promise<GeneralJWS> {
    if (!this._signatures.length) {
      throw new JWSInvalid('at least one signature must be added')
    }

    const jws: GeneralJWS = {
      signatures: [],
      payload: '',
    }

    let payloads = new Set()
    await Promise.all(
      this._signatures.map(async (sig) => {
        const { protectedHeader, unprotectedHeader, options, key } = signatureRef.get(sig)!
        const flattened = new FlattenedSign(this._payload)

        if (protectedHeader) {
          flattened.setProtectedHeader(protectedHeader)
        }

        if (unprotectedHeader) {
          flattened.setUnprotectedHeader(unprotectedHeader)
        }

        const { payload, ...rest } = await flattened.sign(key, options)
        payloads.add(payload)
        jws.payload = payload
        jws.signatures.push(rest)
      }),
    )

    if (payloads.size !== 1) {
      throw new JWSInvalid('inconsistent use of JWS Unencoded Payload Option (RFC7797)')
    }

    return jws
  }
}
