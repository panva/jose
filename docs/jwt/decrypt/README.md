# jwt/decrypt

JSON Web Token (JWT) Decryption (JWT is in JWE format)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTDecryptGetKey](interfaces/JWTDecryptGetKey.md) | Interface for JWT Decryption dynamic key resolution. No token components have been verified at the time of this function call. |
| [JWTDecryptOptions](interfaces/JWTDecryptOptions.md) | Combination of JWE Decryption options and JWT Claims Set verification options. |

## Functions

| Function | Description |
| ------ | ------ |
| [jwtDecrypt](functions/jwtDecrypt.md) | Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT Claims Set. |
