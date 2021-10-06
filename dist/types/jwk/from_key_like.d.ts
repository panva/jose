import type { JWK, KeyLike } from '../types';
declare function fromKeyLike(key: KeyLike | Uint8Array): Promise<JWK>;
export { fromKeyLike };
export default fromKeyLike;
export type { KeyLike, JWK };
