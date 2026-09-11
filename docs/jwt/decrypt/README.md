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
| [jwtDecrypt](functions/jwtDecrypt.md) | Authenticates and decrypts a JWT in JWE Compact Serialization and validates its JWT Claims Set. |
