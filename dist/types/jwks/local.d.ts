import type { KeyLike, JWSHeaderParameters, JSONWebKeySet, FlattenedJWSInput, GetKeyFunction } from '../types';
export declare function isJWKSLike(jwks: unknown): jwks is JSONWebKeySet;
export declare class LocalJWKSet {
    protected _jwks?: JSONWebKeySet;
    private _cached;
    constructor(jwks: unknown);
    getKey(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<KeyLike>;
}
export declare function createLocalJWKSet(jwks: JSONWebKeySet): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
