# jwt/verify

JSON Web Token (JWT) Verification (JWT is in JWS format)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTVerifyGetKey](interfaces/JWTVerifyGetKey.md) | Interface for JWT Verification dynamic key resolution. No token components have been verified at the time of this function call. |
| [JWTVerifyOptions](interfaces/JWTVerifyOptions.md) | Combination of JWS Verification options and JWT Claims Set verification options. |

## Functions

| Function | Description |
| ------ | ------ |
| [jwtVerify](functions/jwtVerify.md) | Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the JWT Claims Set. |
