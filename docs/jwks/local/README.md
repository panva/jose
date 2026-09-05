# jwks/local

Verification using a JSON Web Key Set (JWKS) available locally

## Interfaces

| Interface | Description |
| ------ | ------ |
| [LocalJWKSet](interfaces/LocalJWKSet.md) | A key resolver created by [createLocalJWKSet](functions/createLocalJWKSet.md). |

## Functions

| Function | Description |
| ------ | ------ |
| [createLocalJWKSet](functions/createLocalJWKSet.md) | Creates a resolver for a locally available JSON Web Key Set. Selection uses the header's "alg" (Algorithm) and "kid" (Key ID), and respects the JWK's "use" (Public Key Use) and "key_ops" (Key Operations). Exactly one key must match. |
