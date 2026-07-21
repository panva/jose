/**
 * Selective Disclosure for JSON Web Tokens (SD-JWT)
 *
 * Supports issuing, presenting, and verifying SD-JWTs and SD-JWTs with Key Binding in Compact,
 * Flattened JSON, and General JSON serialization syntaxes.
 *
 * This functionality is exported exclusively from the `'jose/sd-jwt'` subpath.
 *
 * This module implements the SD-JWT format and processing rules in [RFC
 * 9901](https://www.rfc-editor.org/rfc/rfc9901.html). Application profiles remain responsible for
 * defining and enforcing their credential schema, required claims, Issuer trust, accepted
 * algorithms and types, status and revocation checks, and Key Binding policy.
 *
 * Disclosure paths are RFC 6901 JSON Pointers evaluated against the final JWT Claims Set. The
 * producer prevents selective disclosure of `iss`, `exp`, `nbf`, `cnf`, and the complete `aud`
 * claim. Application profiles must likewise avoid selecting any other claim they rely on to
 * determine a credential's validity, as described in [RFC 9901 Section
 * 9.7](https://www.rfc-editor.org/rfc/rfc9901.html#section-9.7).
 *
 * Paths are evaluated against the final Claims Set. For example, `/address/street` selects a nested
 * object member, `/nationalities/1` selects the second array element, and `/a~1b/~0verified`
 * selects `payload['a/b']['~verified']`. Selecting a nested Disclosure for a presentation
 * automatically includes any recursively disclosed parent needed to reach it.
 *
 * Verifiers must always choose an explicit Key Binding policy. `keyBinding: false` rejects a
 * supplied KB-JWT, while a policy object requires and validates one, preventing downgrade by
 * removal.
 *
 * SD-JWT provides selective disclosure, not encryption or anonymity. Use confidential transport and
 * do not assume presentations are unlinkable.
 *
 * @module
 *
 * @example Issue, present, and verify an SD-JWT with mandatory Key Binding
 *
 * ```js
 * import { exportJWK, generateKeyPair } from 'jose'
 * import * as sdJwt from 'jose/sd-jwt'
 *
 * const issuer = 'https://issuer.example'
 * const verifier = 'https://verifier.example'
 * const nonce = crypto.randomUUID() // Issue a fresh nonce for this transaction.
 *
 * const issuerKeys = await generateKeyPair('ES256')
 * const holderKeys = await generateKeyPair('ES256')
 * const holderPublicJwk = await exportJWK(holderKeys.publicKey)
 *
 * // Issuer
 * const issued = await new sdJwt.SignSDJWT({
 *   given_name: 'John',
 *   family_name: 'Doe',
 *   address: {
 *     street_address: '123 Main St',
 *     locality: 'Anytown',
 *   },
 *   cnf: { jwk: holderPublicJwk },
 * })
 *   .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
 *   .setIssuer(issuer)
 *   .setIssuedAt()
 *   .setExpirationTime('2 hours')
 *   .setDisclosurePaths(['/given_name', '/family_name', '/address', '/address/locality'])
 *   .sign(issuerKeys.privateKey)
 *
 * // Holder
 * const credential = await sdJwt.sdJwtReceive(issued, issuerKeys.publicKey, {
 *   algorithms: ['ES256'],
 *   issuer,
 *   typ: 'example+sd-jwt',
 *   requiredClaims: ['exp'],
 * })
 *
 * const presentation = await credential
 *   .addKeyBinding(holderKeys.privateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .setAudience(verifier)
 *   .setNonce(nonce)
 *   .setIssuedAt()
 *   // Selecting this recursive child automatically includes its /address parent.
 *   .present(['/given_name', '/address/locality'])
 *
 * // Verifier
 * const { payload } = await sdJwt.sdJwtVerify(presentation, issuerKeys.publicKey, {
 *   algorithms: ['ES256'],
 *   issuer,
 *   typ: 'example+sd-jwt',
 *   requiredClaims: ['exp'],
 *   keyBinding: {
 *     audience: verifier,
 *     nonce,
 *     algorithms: ['ES256'],
 *     maxTokenAge: '5 minutes',
 *   },
 * })
 * // Atomically mark nonce as consumed in the application's replay store.
 * ```
 *
 * See {@link FlattenedSignSDJWT} and {@link GeneralSignSDJWT} for complete JSON serialization
 * examples using {@link flattenedSdJwtReceive}, {@link generalSdJwtReceive},
 * {@link flattenedSdJwtVerify}, and {@link generalSdJwtVerify}.
 */

export { SignSDJWT, FlattenedSignSDJWT, GeneralSignSDJWT } from './issuer.js'
export type { SDJWTIssuerSigningKey, SDJWTSignature } from './issuer.js'

export { flattenedSdJwtReceive, generalSdJwtReceive, sdJwtReceive } from './holder.js'
export type {
  SDJWTCredential,
  SDJWTDisclosure,
  SDJWTHolderSigningKey,
  SDJWTKeyBinding,
  SDJWTReceiveOptions,
} from './holder.js'

export { flattenedSdJwtVerify, generalSdJwtVerify, sdJwtVerify } from './verifier.js'
export type {
  FlattenedSDJWTVerifyResult,
  GeneralSDJWTVerifyResult,
  SDJWTHolderKeyResolver,
  SDJWTHolderVerificationKey,
  SDJWTKeyBindingPayload,
  SDJWTKeyBindingVerificationOptions,
  SDJWTKeyBindingVerifyResult,
  SDJWTVerifyOptions,
  SDJWTVerifyResult,
} from './verifier.js'

export type {
  FlattenedSDJWT,
  GeneralSDJWT,
  GeneralSDJWTSignature,
  ProduceSDJWT,
  SDJWT,
  SDJWTDecoyCount,
  SDJWTHashAlgorithm,
  SDJWTIssuerGetKey,
  SDJWTIssuerKey,
  SDJWTUnprotectedHeaderParameters,
} from '../types.d.ts'
