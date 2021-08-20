import type { GenerateKeyPairOptions } from '../util/generate_key_pair';
import type { GenerateSecretOptions } from '../util/generate_secret';
export declare function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<Uint8Array | CryptoKey>;
export declare function generateKeyPair(alg: string, options?: GenerateKeyPairOptions): Promise<CryptoKeyPair>;
