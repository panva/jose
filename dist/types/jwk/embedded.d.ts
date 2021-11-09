import type { FlattenedJWSInput, JWSHeaderParameters } from '../types';
export declare function EmbeddedJWK(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<import("../types.d").KeyLike>;
