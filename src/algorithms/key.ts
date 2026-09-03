/** Tree-shakeable key import and generation algorithm capability factories. @module */

import { createAlgorithmFactory as create } from '../lib/algorithm_capability.js'
import * as r from '../lib/key_algorithm.js'
import type { KeyAlgorithmFactory, KeyAlgorithmName } from './types.js'

const IMPORT = 9
const KEY_PAIR = 11
const SECRET = 13

function factory<Algorithm extends KeyAlgorithmName>(
  key: r.KeyRecipe<Algorithm>,
  operations: number,
): KeyAlgorithmFactory<Algorithm> {
  return create({ category: 'key', algorithm: key.alg, key }, operations)
}

/** Creates the `HS256` key utility capability. */
export const HS256: KeyAlgorithmFactory<'HS256'> = /* @__PURE__ */ factory(r.HS256Key, SECRET)
/** Creates the `HS384` key utility capability. */
export const HS384: KeyAlgorithmFactory<'HS384'> = /* @__PURE__ */ factory(r.HS384Key, SECRET)
/** Creates the `HS512` key utility capability. */
export const HS512: KeyAlgorithmFactory<'HS512'> = /* @__PURE__ */ factory(r.HS512Key, SECRET)

/** Creates the `RS256` key utility capability. */
export const RS256: KeyAlgorithmFactory<'RS256'> = /* @__PURE__ */ factory(r.RS256Key, KEY_PAIR)
/** Creates the `RS384` key utility capability. */
export const RS384: KeyAlgorithmFactory<'RS384'> = /* @__PURE__ */ factory(r.RS384Key, KEY_PAIR)
/** Creates the `RS512` key utility capability. */
export const RS512: KeyAlgorithmFactory<'RS512'> = /* @__PURE__ */ factory(r.RS512Key, KEY_PAIR)
/** Creates the `PS256` key utility capability. */
export const PS256: KeyAlgorithmFactory<'PS256'> = /* @__PURE__ */ factory(r.PS256Key, KEY_PAIR)
/** Creates the `PS384` key utility capability. */
export const PS384: KeyAlgorithmFactory<'PS384'> = /* @__PURE__ */ factory(r.PS384Key, KEY_PAIR)
/** Creates the `PS512` key utility capability. */
export const PS512: KeyAlgorithmFactory<'PS512'> = /* @__PURE__ */ factory(r.PS512Key, KEY_PAIR)

/** Creates the `ES256` key utility capability. */
export const ES256: KeyAlgorithmFactory<'ES256'> = /* @__PURE__ */ factory(r.ES256Key, KEY_PAIR)
/** Creates the `ES384` key utility capability. */
export const ES384: KeyAlgorithmFactory<'ES384'> = /* @__PURE__ */ factory(r.ES384Key, KEY_PAIR)
/** Creates the `ES512` key utility capability. */
export const ES512: KeyAlgorithmFactory<'ES512'> = /* @__PURE__ */ factory(r.ES512Key, KEY_PAIR)
/** Creates the `EdDSA` key utility capability. */
export const EdDSA: KeyAlgorithmFactory<'EdDSA'> = /* @__PURE__ */ factory(r.EdDSAKey, KEY_PAIR)
/** Creates the `Ed25519` key utility capability. */
export const Ed25519: KeyAlgorithmFactory<'Ed25519'> = /* @__PURE__ */ factory(
  r.Ed25519Key,
  KEY_PAIR,
)
/** Creates the `ML-DSA-44` key utility capability. */
export const ML_DSA_44: KeyAlgorithmFactory<'ML-DSA-44'> = /* @__PURE__ */ factory(
  r.ML_DSA_44Key,
  KEY_PAIR,
)
/** Creates the `ML-DSA-65` key utility capability. */
export const ML_DSA_65: KeyAlgorithmFactory<'ML-DSA-65'> = /* @__PURE__ */ factory(
  r.ML_DSA_65Key,
  KEY_PAIR,
)
/** Creates the `ML-DSA-87` key utility capability. */
export const ML_DSA_87: KeyAlgorithmFactory<'ML-DSA-87'> = /* @__PURE__ */ factory(
  r.ML_DSA_87Key,
  KEY_PAIR,
)

/** Creates the `dir` key utility capability. */
export const dir: KeyAlgorithmFactory<'dir'> = /* @__PURE__ */ factory(r.dirKey, IMPORT)
/** Creates the `RSA-OAEP` key utility capability. */
export const RSA_OAEP: KeyAlgorithmFactory<'RSA-OAEP'> = /* @__PURE__ */ factory(
  r.RSA_OAEPKey,
  KEY_PAIR,
)
/** Creates the `RSA-OAEP-256` key utility capability. */
export const RSA_OAEP_256: KeyAlgorithmFactory<'RSA-OAEP-256'> = /* @__PURE__ */ factory(
  r.RSA_OAEP_256Key,
  KEY_PAIR,
)
/** Creates the `RSA-OAEP-384` key utility capability. */
export const RSA_OAEP_384: KeyAlgorithmFactory<'RSA-OAEP-384'> = /* @__PURE__ */ factory(
  r.RSA_OAEP_384Key,
  KEY_PAIR,
)
/** Creates the `RSA-OAEP-512` key utility capability. */
export const RSA_OAEP_512: KeyAlgorithmFactory<'RSA-OAEP-512'> = /* @__PURE__ */ factory(
  r.RSA_OAEP_512Key,
  KEY_PAIR,
)
/** Creates the `ECDH-ES` key utility capability. */
export const ECDH_ES: KeyAlgorithmFactory<'ECDH-ES'> = /* @__PURE__ */ factory(
  r.ECDH_ESKey,
  KEY_PAIR,
)
/** Creates the `ECDH-ES+A128KW` key utility capability. */
export const ECDH_ES_A128KW: KeyAlgorithmFactory<'ECDH-ES+A128KW'> = /* @__PURE__ */ factory(
  r.ECDH_ES_A128KWKey,
  KEY_PAIR,
)
/** Creates the `ECDH-ES+A192KW` key utility capability. */
export const ECDH_ES_A192KW: KeyAlgorithmFactory<'ECDH-ES+A192KW'> = /* @__PURE__ */ factory(
  r.ECDH_ES_A192KWKey,
  KEY_PAIR,
)
/** Creates the `ECDH-ES+A256KW` key utility capability. */
export const ECDH_ES_A256KW: KeyAlgorithmFactory<'ECDH-ES+A256KW'> = /* @__PURE__ */ factory(
  r.ECDH_ES_A256KWKey,
  KEY_PAIR,
)

/** Creates the `A128KW` key utility capability. */
export const A128KW: KeyAlgorithmFactory<'A128KW'> = /* @__PURE__ */ factory(r.A128KWKey, SECRET)
/** Creates the `A192KW` key utility capability. */
export const A192KW: KeyAlgorithmFactory<'A192KW'> = /* @__PURE__ */ factory(r.A192KWKey, SECRET)
/** Creates the `A256KW` key utility capability. */
export const A256KW: KeyAlgorithmFactory<'A256KW'> = /* @__PURE__ */ factory(r.A256KWKey, SECRET)
/** Creates the `A128GCMKW` key utility capability. */
export const A128GCMKW: KeyAlgorithmFactory<'A128GCMKW'> = /* @__PURE__ */ factory(
  r.A128GCMKWKey,
  SECRET,
)
/** Creates the `A192GCMKW` key utility capability. */
export const A192GCMKW: KeyAlgorithmFactory<'A192GCMKW'> = /* @__PURE__ */ factory(
  r.A192GCMKWKey,
  SECRET,
)
/** Creates the `A256GCMKW` key utility capability. */
export const A256GCMKW: KeyAlgorithmFactory<'A256GCMKW'> = /* @__PURE__ */ factory(
  r.A256GCMKWKey,
  SECRET,
)

/** Creates the `PBES2-HS256+A128KW` key utility capability. */
export const PBES2_HS256_A128KW: KeyAlgorithmFactory<'PBES2-HS256+A128KW'> =
  /* @__PURE__ */ factory(r.PBES2_HS256_A128KWKey, IMPORT)
/** Creates the `PBES2-HS384+A192KW` key utility capability. */
export const PBES2_HS384_A192KW: KeyAlgorithmFactory<'PBES2-HS384+A192KW'> =
  /* @__PURE__ */ factory(r.PBES2_HS384_A192KWKey, IMPORT)
/** Creates the `PBES2-HS512+A256KW` key utility capability. */
export const PBES2_HS512_A256KW: KeyAlgorithmFactory<'PBES2-HS512+A256KW'> =
  /* @__PURE__ */ factory(r.PBES2_HS512_A256KWKey, IMPORT)

/** Creates the `A128GCM` key utility capability. */
export const A128GCM: KeyAlgorithmFactory<'A128GCM'> = /* @__PURE__ */ factory(r.A128GCMKey, SECRET)
/** Creates the `A192GCM` key utility capability. */
export const A192GCM: KeyAlgorithmFactory<'A192GCM'> = /* @__PURE__ */ factory(r.A192GCMKey, SECRET)
/** Creates the `A256GCM` key utility capability. */
export const A256GCM: KeyAlgorithmFactory<'A256GCM'> = /* @__PURE__ */ factory(r.A256GCMKey, SECRET)
/** Creates the `A128CBC-HS256` key utility capability. */
export const A128CBC_HS256: KeyAlgorithmFactory<'A128CBC-HS256'> = /* @__PURE__ */ factory(
  r.A128CBC_HS256Key,
  SECRET,
)
/** Creates the `A192CBC-HS384` key utility capability. */
export const A192CBC_HS384: KeyAlgorithmFactory<'A192CBC-HS384'> = /* @__PURE__ */ factory(
  r.A192CBC_HS384Key,
  SECRET,
)
/** Creates the `A256CBC-HS512` key utility capability. */
export const A256CBC_HS512: KeyAlgorithmFactory<'A256CBC-HS512'> = /* @__PURE__ */ factory(
  r.A256CBC_HS512Key,
  SECRET,
)

export type {
  KeyAlgorithmFactory,
  KeyAlgorithmName,
  KeyImportAlgorithmFactory,
  KeyImportAlgorithmSelection,
  KeyPairAlgorithmFactory,
  KeyPairAlgorithmName,
  KeyPairAlgorithmSelection,
  SecretAlgorithmFactory,
  SecretAlgorithmName,
  SecretAlgorithmSelection,
} from './types.js'
