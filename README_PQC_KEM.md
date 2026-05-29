# PQC KEM Support for JOSE

This repository contains an experimental implementation of the JOSE parts of
`draft-ietf-jose-pqc-kem`.

## Current Scope

The implementation adds JWE key management support for:

- `ML-KEM-512`
- `ML-KEM-768`
- `ML-KEM-1024`
- `ML-KEM-512+A128KW`
- `ML-KEM-768+A192KW`
- `ML-KEM-1024+A256KW`

Direct key agreement derives the JWE CEK from the ML-KEM shared secret. Key
agreement with key wrap derives an AES-KW key and uses it to wrap the CEK.

The ML-KEM ciphertext is carried in the JOSE `kemct` header parameter as
base64url-encoded data.

## Dependencies

The local Node.js runtime does not provide usable ML-KEM or KMAC256 support via
WebCrypto or `node:crypto`, so the first implementation uses:

- `mlkem` for ML-KEM-512/768/1024
- `@noble/hashes/sha3-addons.js` for KMAC256

The `mlkem` package is the npm package recommended by the
`crystals-kyber-js` project for current ML-KEM/FIPS 203 use.

## JWK Representation

ML-KEM keys are represented as AKP JWKs:

```json
{
  "kty": "AKP",
  "alg": "ML-KEM-512",
  "pub": "..."
}
```

Private keys additionally contain `priv`.

For ML-KEM, `priv` contains the 64-octet seed `d || z`: the first 32 octets are
`d` and the last 32 octets are `z`. The public key and expanded private key are
derived from this seed using `ML-KEM.KeyGen_internal(d, z)`, as specified in
FIPS 203.

## Tests

Run the TypeScript build:

```bash
cd jose
npm run build
```

Run the focused PQC KEM tests:

```bash
cd jose
bash -c 'source .node_flags.sh && npx ava test/jwe/pqkem.test.ts'
```

The current focused tests cover direct key agreement, key agreement with AES-KW,
all three ML-KEM parameter sets, and validation of the 64-octet private seed
representation.

## Next Steps

- Add independent interoperability vectors once another implementation is
  available.
- Add vectors with non-empty `SuppPrivInfo` if this input remains in the draft.
- Add JOSE Compact Serialization or General JSON Serialization vectors.
