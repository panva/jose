import type {
  EcdhAllowedFunction,
  EcdhESDeriveKeyFunction,
  EphemeralKeyToPublicJwkFunction,
  GenerateEpkFunction,
  PublicJwkToEphemeralKeyFunction,
} from './interfaces.d'
export declare const deriveKey: EcdhESDeriveKeyFunction
export declare const ephemeralKeyToPublicJWK: EphemeralKeyToPublicJwkFunction
export declare const generateEpk: GenerateEpkFunction
export declare const publicJwkToEphemeralKey: PublicJwkToEphemeralKeyFunction
export declare const ecdhAllowed: EcdhAllowedFunction
