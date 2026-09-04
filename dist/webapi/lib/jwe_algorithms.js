import { JOSENotSupported } from "../util/errors.js";
import { table } from "./key_descriptor.js";
const wrap = [
  ["encrypt", "wrapKey"],
  ["decrypt", "unwrapKey"]
], derive = [[], ["deriveBits"]], none = [[], []];
function rsaes(bits) {
  return {
    kty: ["RSA"],
    mode: "key-encryption",
    subtle: { name: "RSA-OAEP", hash: `SHA-${bits}` },
    usages: wrap,
    ops: ["wrapKey", "unwrapKey"]
  };
}
function ecdh(mode) {
  return {
    kty: ["EC", "OKP"],
    mode,
    subtle: { name: "ECDH" },
    resolve: ({ kty, crv, asymmetricKeyType }) => {
      if (crv === "X25519" || asymmetricKeyType === "x25519")
        return { name: "X25519" };
      if (kty === "OKP")
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      return { name: "ECDH", namedCurve: crv };
    },
    usages: derive,
    ops: [void 0, "deriveBits"]
  };
}
function aeskw(bits, gcm = !1) {
  return {
    kty: ["oct"],
    mode: "key-wrapping",
    secret: !0,
    subtle: { name: gcm ? "AES-GCM" : "AES-KW", length: bits },
    usages: none,
    ops: gcm ? ["encrypt", "decrypt"] : ["wrapKey", "unwrapKey"]
  };
}
function pbes2() {
  return {
    kty: ["oct"],
    mode: "key-wrapping",
    secret: !0,
    subtle: { name: "PBKDF2" },
    usages: none,
    ops: ["deriveBits", "deriveBits"]
  };
}
const JWE = table({
  dir: {
    kty: ["oct"],
    mode: "direct-encryption",
    secret: !0,
    subtle: { name: "AES-GCM" },
    usages: none,
    ops: ["encrypt", "decrypt"]
  },
  "RSA-OAEP": rsaes(1),
  "RSA-OAEP-256": rsaes(256),
  "RSA-OAEP-384": rsaes(384),
  "RSA-OAEP-512": rsaes(512),
  "ECDH-ES": ecdh("direct-key-agreement"),
  "ECDH-ES+A128KW": ecdh("key-agreement-with-key-wrapping"),
  "ECDH-ES+A192KW": ecdh("key-agreement-with-key-wrapping"),
  "ECDH-ES+A256KW": ecdh("key-agreement-with-key-wrapping"),
  A128KW: aeskw(128),
  A192KW: aeskw(192),
  A256KW: aeskw(256),
  A128GCMKW: aeskw(128, !0),
  A192GCMKW: aeskw(192, !0),
  A256GCMKW: aeskw(256, !0),
  "PBES2-HS256+A128KW": pbes2(),
  "PBES2-HS384+A192KW": pbes2(),
  "PBES2-HS512+A256KW": pbes2()
}), contentOps = ["encrypt", "decrypt"];
function contentEncryption(bits, cbc = !1) {
  return {
    kty: ["oct"],
    secret: !0,
    subtle: { name: cbc ? "AES-CBC" : "AES-GCM", length: bits },
    usages: none,
    ops: contentOps,
    cekBits: bits,
    ivBits: cbc ? 128 : 96,
    cbc
  };
}
const ENC = table({
  A128GCM: contentEncryption(128),
  A192GCM: contentEncryption(192),
  A256GCM: contentEncryption(256),
  "A128CBC-HS256": contentEncryption(256, !0),
  "A192CBC-HS384": contentEncryption(384, !0),
  "A256CBC-HS512": contentEncryption(512, !0)
});
function unsupported(parameter, name) {
  throw new JOSENotSupported(`Invalid or unsupported "${parameter}" (JWE ${name}) header value`);
}
function jweAlgorithm(alg) {
  return (typeof alg == "string" ? JWE[alg] : void 0) ?? unsupported("alg", "Algorithm");
}
function isJWECEKTransport(algorithm) {
  return algorithm.mode === "key-wrapping" || algorithm.mode === "key-encryption" || algorithm.mode === "key-agreement-with-key-wrapping";
}
function invalidJWEKeyManagementMode(_mode) {
  throw new TypeError("Invalid JWE key management mode");
}
function jweEncryption(enc) {
  return (typeof enc == "string" ? ENC[enc] : void 0) ?? unsupported("enc", "Encryption Algorithm");
}
export {
  JWE,
  invalidJWEKeyManagementMode,
  isJWECEKTransport,
  jweAlgorithm,
  jweEncryption
};
