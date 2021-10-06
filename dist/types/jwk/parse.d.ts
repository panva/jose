import type { JWK, KeyLike } from '../types';
declare function parseJwk(jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike | Uint8Array>;
export { parseJwk };
export default parseJwk;
export type { KeyLike, JWK };
