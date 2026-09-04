# jwks/local

Verification using a JSON Web Key Set (JWKS) available locally

## Interfaces

| Interface | Description |
| ------ | ------ |
| [LocalJWKSet](interfaces/LocalJWKSet.md) | The key resolution function returned by [createLocalJWKSet](functions/createLocalJWKSet.md). |

## Functions

| Function | Description |
| ------ | ------ |
| [createLocalJWKSet](functions/createLocalJWKSet.md) | Returns a function that resolves a JWS JOSE Header to a public key object from a locally stored, or otherwise available, JSON Web Key Set. Selection respects the header's "alg" (Algorithm) and "kid" (Key ID) as well as the JWK's "use" (Public Key Use) and "key_ops" (Key Operations). Exactly one key must match; if multiple keys match, the thrown `JWKSMultipleMatchingKeys` can be iterated. |
