import type { KeyLike, DecryptOptions, JWTClaimVerificationOptions, GetKeyFunction, CompactJWEHeaderParameters, FlattenedJWE, JWTDecryptResult, ResolvedKey } from '../types';
export interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {
}
export interface JWTDecryptGetKey extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {
}
export declare function jwtDecrypt(jwt: string | Uint8Array, key: KeyLike | Uint8Array, options?: JWTDecryptOptions): Promise<JWTDecryptResult>;
export declare function jwtDecrypt(jwt: string | Uint8Array, getKey: JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<JWTDecryptResult & ResolvedKey>;
