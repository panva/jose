# jwk/embedded

Verification using a JWK Embedded in a JWS Header

## Functions

| Function | Description |
| ------ | ------ |
| [EmbeddedJWK](functions/EmbeddedJWK.md) | EmbeddedJWK is an implementation of a [GetKeyFunction](../../types/interfaces/GetKeyFunction.md) intended to be used with the JWS/JWT verify operations whenever you need to opt-in to verify signatures with a public key embedded in the token's "jwk" (JSON Web Key) Header Parameter. It is recommended to combine this with the verify function's `algorithms` option to define accepted JWS "alg" (Algorithm) Header Parameter values. |
