/** Tree-shakeable JWS algorithm capability factories. @module */

import { createAlgorithmFactory } from '../lib/algorithm_capability.js'
import {
  Ed25519Key,
  EdDSAKey,
  ES256Key,
  ES384Key,
  ES512Key,
  HS256Key,
  HS384Key,
  HS512Key,
  ML_DSA_44Key,
  ML_DSA_65Key,
  ML_DSA_87Key,
  PS256Key,
  PS384Key,
  PS512Key,
  RS256Key,
  RS384Key,
  RS512Key,
  type SigningKeyRecipe,
} from '../lib/key_algorithm.js'

import type { JWSAlgorithmFactory, JWSAlgorithmName } from './types.js'

function jws<Algorithm extends JWSAlgorithmName>(
  key: SigningKeyRecipe<Algorithm>,
): JWSAlgorithmFactory<Algorithm> {
  return createAlgorithmFactory(
    {
      category: 'jws',
      algorithm: key.alg,
      key,
    },
    0,
  ) as JWSAlgorithmFactory<Algorithm>
}

/** The `HS256` JWS algorithm capability factory. */
export const HS256: JWSAlgorithmFactory<'HS256'> = /* @__PURE__ */ jws(HS256Key)

/** The `HS384` JWS algorithm capability factory. */
export const HS384: JWSAlgorithmFactory<'HS384'> = /* @__PURE__ */ jws(HS384Key)

/** The `HS512` JWS algorithm capability factory. */
export const HS512: JWSAlgorithmFactory<'HS512'> = /* @__PURE__ */ jws(HS512Key)

/** The `RS256` JWS algorithm capability factory. */
export const RS256: JWSAlgorithmFactory<'RS256'> = /* @__PURE__ */ jws(RS256Key)

/** The `RS384` JWS algorithm capability factory. */
export const RS384: JWSAlgorithmFactory<'RS384'> = /* @__PURE__ */ jws(RS384Key)

/** The `RS512` JWS algorithm capability factory. */
export const RS512: JWSAlgorithmFactory<'RS512'> = /* @__PURE__ */ jws(RS512Key)

/** The `PS256` JWS algorithm capability factory. */
export const PS256: JWSAlgorithmFactory<'PS256'> = /* @__PURE__ */ jws(PS256Key)

/** The `PS384` JWS algorithm capability factory. */
export const PS384: JWSAlgorithmFactory<'PS384'> = /* @__PURE__ */ jws(PS384Key)

/** The `PS512` JWS algorithm capability factory. */
export const PS512: JWSAlgorithmFactory<'PS512'> = /* @__PURE__ */ jws(PS512Key)

/** The `ES256` JWS algorithm capability factory. */
export const ES256: JWSAlgorithmFactory<'ES256'> = /* @__PURE__ */ jws(ES256Key)

/** The `ES384` JWS algorithm capability factory. */
export const ES384: JWSAlgorithmFactory<'ES384'> = /* @__PURE__ */ jws(ES384Key)

/** The `ES512` JWS algorithm capability factory. */
export const ES512: JWSAlgorithmFactory<'ES512'> = /* @__PURE__ */ jws(ES512Key)

/** The `EdDSA` JWS algorithm capability factory. */
export const EdDSA: JWSAlgorithmFactory<'EdDSA'> = /* @__PURE__ */ jws(EdDSAKey)

/** The `Ed25519` JWS algorithm capability factory. */
export const Ed25519: JWSAlgorithmFactory<'Ed25519'> = /* @__PURE__ */ jws(Ed25519Key)

/** The `ML-DSA-44` JWS algorithm capability factory. */
export const ML_DSA_44: JWSAlgorithmFactory<'ML-DSA-44'> = /* @__PURE__ */ jws(ML_DSA_44Key)

/** The `ML-DSA-65` JWS algorithm capability factory. */
export const ML_DSA_65: JWSAlgorithmFactory<'ML-DSA-65'> = /* @__PURE__ */ jws(ML_DSA_65Key)

/** The `ML-DSA-87` JWS algorithm capability factory. */
export const ML_DSA_87: JWSAlgorithmFactory<'ML-DSA-87'> = /* @__PURE__ */ jws(ML_DSA_87Key)

export type {
  AsymmetricJWSAlgorithmName,
  JWSAlgorithmName,
  JWSAlgorithmOf,
  JWSKeyInput,
  JWSResolvedKey,
  SelectedCompactJWSHeaderParameters,
  SelectedJWSHeaderParameters,
  SelectedJWSVerifyOptions,
  SelectedJWTHeaderParameters,
} from './types.js'

/** Represents a factory for one built-in JWS algorithm capability. */
export type { JWSAlgorithmFactory } from './types.js'

/** Represents a non-empty tuple of built-in JWS algorithm factories. */
export type { JWSAlgorithmSelection } from './types.js'

/** Represents a non-empty tuple of built-in asymmetric JWS algorithm factories. */
export type { AsymmetricJWSAlgorithmFactory, AsymmetricJWSAlgorithmSelection } from './types.js'
