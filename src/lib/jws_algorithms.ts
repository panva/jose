import {
  Ed25519,
  EdDSA,
  ES256,
  ES384,
  ES512,
  HS256,
  HS384,
  HS512,
  ML_DSA_44,
  ML_DSA_65,
  ML_DSA_87,
  PS256,
  PS384,
  PS512,
  RS256,
  RS384,
  RS512,
} from '../algorithms/jws.js'
import {
  createJWSAlgorithmResolver,
  loadJWSAlgorithms,
  type JWSAlgorithm,
  type JWSAlgorithmCapability,
  type JWSAlgorithmCapabilityMap,
  type JWSAlgorithmFactory,
  type JWSAlgorithmResolver,
  type JWSAlgorithmSelection,
} from './jws_algorithm.js'
import { trustedAlgorithmMap } from './algorithm_capability.js'

export type {
  JWSAlgorithm,
  JWSAlgorithmCapability,
  JWSAlgorithmFactory,
  JWSAlgorithmResolver,
  JWSAlgorithmSelection,
}
export { loadJWSAlgorithms }

export const allJWSAlgorithms = trustedAlgorithmMap([
  HS256(),
  HS384(),
  HS512(),
  RS256(),
  RS384(),
  RS512(),
  PS256(),
  PS384(),
  PS512(),
  ES256(),
  ES384(),
  ES512(),
  EdDSA(),
  Ed25519(),
  ML_DSA_44(),
  ML_DSA_65(),
  ML_DSA_87(),
]) as unknown as JWSAlgorithmCapabilityMap

/** Resolves a JWS `alg` against the fully composed built-in selection. */
export const jwsAlgorithm: JWSAlgorithmResolver = createJWSAlgorithmResolver(allJWSAlgorithms)
