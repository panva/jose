import type * as t from '../../types.d.ts';
/** Resolves a key for General JWS verification from unverified headers and token data. */
export interface GeneralVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a General JWS signature and decodes its payload.
 *
 * > Note: Returns payload and headers from the first signature that verifies successfully. Other entries'
 * > headers may be inspected to reject inconsistent use of the JWS Unencoded Payload Option, but are
 * > not included in the result. Rely only on the returned data.
 *
 * @param key Public key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function generalVerify(jws: t.GeneralJWSInput, key: t.KeyInput, options?: t.VerifyOptions): Promise<t.GeneralVerifyResult>;
/**
 * Verifies a General JWS signature and decodes its payload with a dynamically resolved key,
 * included in the result.
 *
 * @param getKey Resolves a public key or shared secret from unverified token data.
 */
export declare function generalVerify<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jws: t.GeneralJWSInput, getKey: GeneralVerifyGetKey<KeyType>, options?: t.VerifyOptions): Promise<t.GeneralVerifyResult & t.ResolvedKey<KeyType>>;
/**
 * Verifies a General JWS and decodes its payload using a key or key resolver. The result includes
 * `key` only when a resolver is used.
 *
 * @param key Public key or shared secret, or a function resolving one.
 */
export declare function generalVerify(jws: t.GeneralJWSInput, key: t.KeyInput | GeneralVerifyGetKey, options?: t.VerifyOptions): Promise<t.GeneralVerifyResult & Partial<t.ResolvedKey>>;
