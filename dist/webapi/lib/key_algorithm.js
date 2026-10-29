import { JOSENotSupported } from "../util/errors.js";
import { JWS } from "./jws_algorithms.js";
import { JWE } from "./jwe_algorithms.js";
const algArgument = '"alg" (Algorithm)';
function unsupportedAlg(source = 'JWK "alg" (Algorithm) Parameter') {
  throw new JOSENotSupported(`Invalid or unsupported ${source} value`);
}
function keyAlgorithm(alg, source) {
  return (typeof alg == "string" ? JWS[alg] ?? JWE[alg] : void 0) ?? unsupportedAlg(source);
}
export {
  algArgument,
  keyAlgorithm,
  unsupportedAlg
};
