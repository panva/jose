/// <reference types="node" />
import type { KeyObject, FlattenedJWSInput, JWSHeaderParameters } from '../types.d';
declare function EmbeddedJWK(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<CryptoKey | KeyObject>;
export { EmbeddedJWK };
export default EmbeddedJWK;
