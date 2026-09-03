# composable/jwt/verify

Composable JWT verification.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTVerifyFunction](interfaces/JWTVerifyFunction.md) | Callable JWT verifier restricted at runtime to the selected JWS algorithms. |
| [JWTVerifyGetKey](interfaces/JWTVerifyGetKey.md) | Dynamic key resolver used by a composed JWT verifier. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [JWTVerifyOptions](type-aliases/JWTVerifyOptions.md) | Verification options with IntelliSense for the selected JWS algorithms. |
| [JWTVerifyResult](type-aliases/JWTVerifyResult.md) | JWT verification result with header suggestions from the selected JWS algorithms. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeJwtVerify](functions/composeJwtVerify.md) | Composes a JWT verifier supporting the selected JWS algorithms. |
