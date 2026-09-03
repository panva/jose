import {
  A128GCMKW,
  A128KW,
  A192GCMKW,
  A192KW,
  A256GCMKW,
  A256KW,
  dir,
  ECDH_ES,
  ECDH_ES_A128KW,
  ECDH_ES_A192KW,
  ECDH_ES_A256KW,
  PBES2_HS256_A128KW,
  PBES2_HS384_A192KW,
  PBES2_HS512_A256KW,
  RSA_OAEP,
  RSA_OAEP_256,
  RSA_OAEP_384,
  RSA_OAEP_512,
} from '../algorithms/jwe.js'
import {
  A128CBC_HS256,
  A128GCM,
  A192CBC_HS384,
  A192GCM,
  A256CBC_HS512,
  A256GCM,
} from '../algorithms/jwe/enc.js'
import { DEF } from '../algorithms/jwe/zip.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { resolveJWEContentEncryption, type JWEAlgorithmSet } from './jwe_algorithm.js'
import { trustedAlgorithmMap } from './algorithm_capability.js'

/** Content-encryption key metadata used by the low-level CEK and IV helpers. */
export interface JWEEncryption extends KeyDescriptor {
  cekBits: number
  ivBits: number
  cbc: boolean
}

export const allJWEAlgorithms: JWEAlgorithmSet = Object.freeze({
  alg: trustedAlgorithmMap([
    dir(),
    RSA_OAEP(),
    RSA_OAEP_256(),
    RSA_OAEP_384(),
    RSA_OAEP_512(),
    ECDH_ES(),
    ECDH_ES_A128KW(),
    ECDH_ES_A192KW(),
    ECDH_ES_A256KW(),
    A128KW(),
    A192KW(),
    A256KW(),
    A128GCMKW(),
    A192GCMKW(),
    A256GCMKW(),
    PBES2_HS256_A128KW(),
    PBES2_HS384_A192KW(),
    PBES2_HS512_A256KW(),
  ]) as unknown as JWEAlgorithmSet['alg'],
  enc: trustedAlgorithmMap([
    A128GCM(),
    A192GCM(),
    A256GCM(),
    A128CBC_HS256(),
    A192CBC_HS384(),
    A256CBC_HS512(),
  ]) as unknown as JWEAlgorithmSet['enc'],
  zip: trustedAlgorithmMap([DEF()]) as unknown as JWEAlgorithmSet['zip'],
})

export function jweEncryption(enc: unknown): JWEEncryption {
  const capability = resolveJWEContentEncryption(allJWEAlgorithms, enc)
  return {
    ...capability.key,
    cekBits: capability.cekBits,
    ivBits: capability.ivBits,
    cbc: capability.key.subtle.name === 'AES-CBC',
  } as JWEEncryption
}
