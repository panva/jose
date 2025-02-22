export { compactDecrypt } from './jwe/compact/decrypt.ts'
export type { CompactDecryptGetKey } from './jwe/compact/decrypt.ts'
export { flattenedDecrypt } from './jwe/flattened/decrypt.ts'
export type { FlattenedDecryptGetKey } from './jwe/flattened/decrypt.ts'
export { generalDecrypt } from './jwe/general/decrypt.ts'
export type { GeneralDecryptGetKey } from './jwe/general/decrypt.ts'
export { GeneralEncrypt } from './jwe/general/encrypt.ts'
export type { Recipient } from './jwe/general/encrypt.ts'

export { compactVerify } from './jws/compact/verify.ts'
export type { CompactVerifyGetKey } from './jws/compact/verify.ts'
export { flattenedVerify } from './jws/flattened/verify.ts'
export type { FlattenedVerifyGetKey } from './jws/flattened/verify.ts'
export { generalVerify } from './jws/general/verify.ts'
export type { GeneralVerifyGetKey } from './jws/general/verify.ts'

export { jwtVerify } from './jwt/verify.ts'
export type { JWTVerifyOptions, JWTVerifyGetKey } from './jwt/verify.ts'
export { jwtDecrypt } from './jwt/decrypt.ts'
export type { JWTDecryptOptions, JWTDecryptGetKey } from './jwt/decrypt.ts'
export type { ProduceJWT } from './jwt/produce.ts'

export { CompactEncrypt } from './jwe/compact/encrypt.ts'
export { FlattenedEncrypt } from './jwe/flattened/encrypt.ts'

export { CompactSign } from './jws/compact/sign.ts'
export { FlattenedSign } from './jws/flattened/sign.ts'
export { GeneralSign } from './jws/general/sign.ts'
export type { Signature } from './jws/general/sign.ts'

export { SignJWT } from './jwt/sign.ts'
export { EncryptJWT } from './jwt/encrypt.ts'

export { calculateJwkThumbprint, calculateJwkThumbprintUri } from './jwk/thumbprint.ts'
export { EmbeddedJWK } from './jwk/embedded.ts'

export { createLocalJWKSet } from './jwks/local.ts'
export { createRemoteJWKSet, jwksCache } from './jwks/remote.ts'
export type {
  RemoteJWKSetOptions,
  JWKSCacheInput,
  ExportedJWKSCache,
  customFetch,
  FetchImplementation,
} from './jwks/remote.ts'

export { UnsecuredJWT } from './jwt/unsecured.ts'
export type { UnsecuredResult } from './jwt/unsecured.ts'

export { exportPKCS8, exportSPKI, exportJWK } from './key/export.ts'

export { importSPKI, importPKCS8, importX509, importJWK } from './key/import.ts'
export type { KeyImportOptions } from './key/import.ts'

export { decodeProtectedHeader } from './util/decode_protected_header.ts'
export { decodeJwt } from './util/decode_jwt.ts'
export type { ProtectedHeaderParameters } from './util/decode_protected_header.ts'

export * as errors from './util/errors.ts'

export { generateKeyPair } from './key/generate_key_pair.ts'
export type { GenerateKeyPairResult, GenerateKeyPairOptions } from './key/generate_key_pair.ts'
export { generateSecret } from './key/generate_secret.ts'
export type { GenerateSecretOptions } from './key/generate_secret.ts'

export * as base64url from './util/base64url.ts'

export type {
  CompactDecryptResult,
  CompactJWEHeaderParameters,
  CompactJWSHeaderParameters,
  CompactVerifyResult,
  CritOption,
  CryptoKey,
  DecryptOptions,
  EncryptOptions,
  FlattenedDecryptResult,
  FlattenedJWE,
  FlattenedJWS,
  FlattenedJWSInput,
  FlattenedVerifyResult,
  GeneralDecryptResult,
  GeneralJWE,
  GeneralJWS,
  GeneralJWSInput,
  GeneralVerifyResult,
  GetKeyFunction,
  JoseHeaderParameters,
  JSONWebKeySet,
  JWEHeaderParameters,
  JWEKeyManagementHeaderParameters,
  JWK_EC_Private,
  JWK_EC_Public,
  JWK_oct,
  JWK_OKP_Private,
  JWK_OKP_Public,
  JWK_RSA_Private,
  JWK_RSA_Public,
  JWK,
  JWKParameters,
  JWSHeaderParameters,
  JWTClaimVerificationOptions,
  JWTDecryptResult,
  JWTHeaderParameters,
  JWTPayload,
  JWTVerifyResult,
  KeyObject,
  ResolvedKey,
  SignOptions,
  VerifyOptions,
} from './types.d.ts'

export const cryptoRuntime = 'WebCryptoAPI'
