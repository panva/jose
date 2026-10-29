import { jwkToKey, normalizeJwk } from "../lib/key.js";
import { jwsAlgorithm } from "../lib/jws_algorithms.js";
import { isObject } from "../lib/validate.js";
import { JWSInvalid } from "../util/errors.js";
async function EmbeddedJWK(protectedHeader, token) {
  const joseHeader = {
    ...protectedHeader,
    ...token?.header
  };
  if (!isObject(joseHeader.jwk))
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
  let jwk;
  try {
    jwk = normalizeJwk(joseHeader.jwk);
  } catch (cause) {
    throw new JWSInvalid("Invalid Embedded JWK", { cause });
  }
  const entry = jwsAlgorithm(joseHeader.alg);
  if (jwk.use !== void 0 && jwk.use !== "sig")
    throw new JWSInvalid('Invalid Embedded JWK, its "use" must be "sig" when present');
  if (jwk.alg !== void 0 && jwk.alg !== entry.alg)
    throw new JWSInvalid(`Invalid Embedded JWK, its "alg" must be "${entry.alg}" when present`);
  const key = await jwkToKey(entry, jwk, !0);
  if (key.type !== "public")
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
  return key;
}
export {
  EmbeddedJWK
};
