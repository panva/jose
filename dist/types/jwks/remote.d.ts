import type { JWSHeaderParameters, FlattenedJWSInput, GetKeyFunction } from '../types';
export interface RemoteJWKSetOptions {
    timeoutDuration?: number;
    cooldownDuration?: number;
    agent?: any;
}
declare function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
export { createRemoteJWKSet };
export default createRemoteJWKSet;
