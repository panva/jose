# composable/jwt/decrypt

Composable JWT decryption.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedCompactJWEHeader](interfaces/ComposedCompactJWEHeader.md) | A Compact JWE header with IntelliSense for the algorithms supplied to a composer. |
| [ComposedJWTDecryptFunction](interfaces/ComposedJWTDecryptFunction.md) | A JWT decryptor restricted to the selected JWE algorithms. |
| [ComposedJWTDecryptGetKey](interfaces/ComposedJWTDecryptGetKey.md) | Dynamic key resolver for composed JWT decryption. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ComposedDecryptOptions](type-aliases/ComposedDecryptOptions.md) | JWE decrypt options with IntelliSense for the algorithms supplied to a composer. |
| [ComposedJWTDecryptOptions](type-aliases/ComposedJWTDecryptOptions.md) | JWT decryption options with IntelliSense for the selected JWE algorithms. |
| [ComposedJWTDecryptResult](type-aliases/ComposedJWTDecryptResult.md) | A JWT decryption result with protected-header suggestions from the selected JWE algorithms. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeJwtDecrypt](functions/composeJwtDecrypt.md) | Composes a JWT decryptor from the selected JWE algorithm factories. |
