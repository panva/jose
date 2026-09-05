# jwt/decrypt

JSON Web Token (JWT) Decryption (JWT is in JWE format)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTDecryptGetKey](interfaces/JWTDecryptGetKey.md) | Resolves a JWT decryption key. No token components have been authenticated when this function is called. |
| [JWTDecryptOptions](interfaces/JWTDecryptOptions.md) | JWE decryption and JWT Claims Set validation options. |

## Functions

| Function | Description |
| ------ | ------ |
| [jwtDecrypt](functions/jwtDecrypt.md) | Decrypts a Compact JWE-formatted JWT and validates its Claims Set. |
