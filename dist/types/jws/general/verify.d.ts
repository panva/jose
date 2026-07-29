import type * as types from '../../types.d.ts';
/**
 * Interface for General JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface GeneralVerifyGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.JWSHeaderParameters, types.FlattenedJWSInput, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Verifies the signature and format of and afterwards decodes the General JWS.
 *
 * > Note: The function iterates over the `signatures` array in the General JWS and returns the verification
 * > result of the first signature entry that can be successfully verified. The result only contains
 * > the payload, protected header, and unprotected header of that successfully verified signature
 * > entry. Other signature entries in the General JWS are not validated, and their headers are not
 * > included in the returned result. Recipients of a General JWS should only rely on the returned
 * > (verified) data.
 *
 * @param jws General JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export declare function generalVerify(jws: types.GeneralJWSInput, key: types.KeyInput, options?: types.VerifyOptions): Promise<types.GeneralVerifyResult>;
/**
 * Verifies the signature and format of and afterwards decodes the General JWS, resolving the key
 * dynamically. The result additionally carries the {@link types.ResolvedKey.key resolved key}.
 *
 * @param jws General JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export declare function generalVerify<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jws: types.GeneralJWSInput, getKey: GeneralVerifyGetKey<KeyType>, options?: types.VerifyOptions): Promise<types.GeneralVerifyResult & types.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jws General JWS.
 * @param key Key, or function resolving a key, to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export declare function generalVerify(jws: types.GeneralJWSInput, key: types.KeyInput | GeneralVerifyGetKey, options?: types.VerifyOptions): Promise<types.GeneralVerifyResult & Partial<types.ResolvedKey>>;
