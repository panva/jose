import type { JWK, KeyLike } from '../types.d';
declare function parseJwk(jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike>;
export { parseJwk };
export default parseJwk;
export type { KeyLike, JWK };
