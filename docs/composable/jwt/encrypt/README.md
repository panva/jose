# composable/jwt/encrypt

Composable JWT encryption.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedEncryptJWT](interfaces/ComposedEncryptJWT.md) | An encrypted JWT producer whose protected header suggests the selected algorithms. |
| [ComposedEncryptJWTConstructor](interfaces/ComposedEncryptJWTConstructor.md) | Constructor for an encrypted JWT producer with the selected header type. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ComposedJWTHeader](type-aliases/ComposedJWTHeader.md) | A JWT JWE header with IntelliSense for the algorithms supplied to a composer. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeEncryptJWT](functions/composeEncryptJWT.md) | Composes an encrypted JWT producer class from the selected JWE algorithm factories. |
