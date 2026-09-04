import type * as t from '../../types.d.ts';
/** Dynamic key resolver for General JWS verification. */
export interface GeneralVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a General JWS signature and decodes its payload.
 *
 * > Note: The function iterates over the `signatures` array in the General JWS and returns the verification
 * > result of the first signature entry that can be successfully verified. The result only contains
 * > the payload, protected header, and unprotected header of that successfully verified signature
 * > entry. Other signature entries' headers may be inspected solely to reject inconsistent use of the
 * > JWS Unencoded Payload Option, and their headers are not included in the returned result.
 * > Recipients of a General JWS should only rely on the returned (verified) data.
 *
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function generalVerify(jws: t.GeneralJWSInput, key: t.KeyInput, options?: t.VerifyOptions): Promise<t.GeneralVerifyResult>;
/**
 * Verifies a General JWS signature and decodes its payload, resolving the key dynamically. The
 * result additionally carries the {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function generalVerify<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jws: t.GeneralJWSInput, getKey: GeneralVerifyGetKey<KeyType>, options?: t.VerifyOptions): Promise<t.GeneralVerifyResult & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Key, or function resolving a key, to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function generalVerify(jws: t.GeneralJWSInput, key: t.KeyInput | GeneralVerifyGetKey, options?: t.VerifyOptions): Promise<t.GeneralVerifyResult & Partial<t.ResolvedKey>>;
