import type { JWK, KeyLike } from '../types.d';
declare function fromKeyLike(key: KeyLike): Promise<JWK>;
export { fromKeyLike };
export default fromKeyLike;
export type { KeyLike, JWK };
