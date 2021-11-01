import type { JWSHeaderParameters, FlattenedJWSInput, GetKeyFunction } from '../types';
export interface RemoteJWKSetOptions {
    timeoutDuration?: number;
    cooldownDuration?: number;
    agent?: any;
}
interface URL {
    href: string;
}
export declare function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
export {};
