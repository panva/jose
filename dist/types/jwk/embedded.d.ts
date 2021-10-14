import type { FlattenedJWSInput, JWSHeaderParameters } from '../types';
declare function EmbeddedJWK(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<import("../types.d").KeyLike>;
export { EmbeddedJWK };
export default EmbeddedJWK;
