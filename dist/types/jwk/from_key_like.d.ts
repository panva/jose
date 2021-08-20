import type { JWK, KeyLike } from '../types';
declare function fromKeyLike(key: KeyLike): Promise<JWK>;
export { fromKeyLike };
export default fromKeyLike;
export type { KeyLike, JWK };
