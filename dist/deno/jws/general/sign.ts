import type * as types from '../../types.d.ts'
import { FlattenedSign } from '../flattened/sign.ts'
import { JWSInvalid } from '../../util/errors.ts'

export interface Signature {
  /**
   * Sets the JWS Protected Header on the Signature object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): Signature

  /**
   * Sets the JWS Unprotected Header on the Signature object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): Signature

  /** A shorthand for calling addSignature() on the enclosing GeneralSign instance */
  addSignature(...args: Parameters<GeneralSign['addSignature']>): Signature

  /** A shorthand for calling encrypt() on the enclosing GeneralSign instance */
  sign(...args: Parameters<GeneralSign['sign']>): Promise<types.GeneralJWS>

  /** Returns the enclosing GeneralSign */
  done(): GeneralSign
}

class IndividualSignature implements Signature {
  private parent: GeneralSign

  protectedHeader?: types.JWSHeaderParameters
  unprotectedHeader?: types.JWSHeaderParameters
  options?: types.SignOptions
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array

  constructor(
    sig: GeneralSign,
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.SignOptions,
  ) {
    this.parent = sig
    this.key = key
    this.options = options
  }

  setProtectedHeader(protectedHeader: types.JWSHeaderParameters) {
    if (this.protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this.protectedHeader = protectedHeader
    return this
  }

  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters) {
    if (this.unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
    this.unprotectedHeader = unprotectedHeader
    return this
  }

  addSignature(...args: Parameters<GeneralSign['addSignature']>) {
    return this.parent.addSignature(...args)
  }

  sign(...args: Parameters<GeneralSign['sign']>) {
    return this.parent.sign(...args)
  }

  done() {
    return this.parent
  }
}

/**
 * The GeneralSign class is used to build and sign General JWS objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/general/sign'`.
 *
 */
export class GeneralSign {
  private _payload: Uint8Array

  private _signatures: IndividualSignature[] = []

  /** @param payload Binary representation of the payload to sign. */
  constructor(payload: Uint8Array) {
    this._payload = payload
  }

  /**
   * Adds an additional signature for the General JWS object.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.SignOptions,
  ): Signature {
    const signature = new IndividualSignature(this, key, options)
    this._signatures.push(signature)
    return signature
  }

  /** Signs and resolves the value of the General JWS object. */
  async sign(): Promise<types.GeneralJWS> {
    if (!this._signatures.length) {
      throw new JWSInvalid('at least one signature must be added')
    }

    const jws: types.GeneralJWS = {
      signatures: [],
      payload: '',
    }

    for (let i = 0; i < this._signatures.length; i++) {
      const signature = this._signatures[i]
      const flattened = new FlattenedSign(this._payload)

      flattened.setProtectedHeader(signature.protectedHeader!)
      flattened.setUnprotectedHeader(signature.unprotectedHeader!)

      const { payload, ...rest } = await flattened.sign(signature.key, signature.options)
      if (i === 0) {
        jws.payload = payload
      } else if (jws.payload !== payload) {
        throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)')
      }
      jws.signatures.push(rest)
    }

    return jws
  }
}
