# jwt/verify

JSON Web Token (JWT) Verification (JWT is in JWS format)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTVerifyGetKey](interfaces/JWTVerifyGetKey.md) | Resolves a JWT verification key. No token components have been authenticated when this function is called. |
| [JWTVerifyOptions](interfaces/JWTVerifyOptions.md) | JWS verification and JWT Claims Set validation options. |

## Functions

| Function | Description |
| ------ | ------ |
| [jwtVerify](functions/jwtVerify.md) | Verifies a Compact JWS-formatted JWT and validates its Claims Set. |
