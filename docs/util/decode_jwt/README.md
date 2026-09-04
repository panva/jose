# util/decode\_jwt

JSON Web Token (JWT) Claims Set Decoding (no validation, no signature checking)

## Functions

| Function | Description |
| ------ | ------ |
| [decodeJwt](functions/decodeJwt.md) | Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation and JWE decryption use `jose.jwtDecrypt()`. |
