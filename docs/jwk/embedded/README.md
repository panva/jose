# jwk/embedded

Verification using a JWK Embedded in a JWS Header

## Functions

| Function | Description |
| ------ | ------ |
| [EmbeddedJWK](functions/EmbeddedJWK.md) | Resolves a verification key from an embedded "jwk" (JSON Web Key) Header Parameter. This key resolver opts JWS and JWT verification into trusting a public key supplied by the token. Use the verification function's `algorithms` option to restrict accepted algorithms. |
