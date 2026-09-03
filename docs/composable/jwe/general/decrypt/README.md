# composable/jwe/general/decrypt

Composable General JWE decryption.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedGeneralDecryptFunction](interfaces/ComposedGeneralDecryptFunction.md) | A General JWE decryptor restricted to the selected algorithms. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ComposedGeneralDecryptResult](type-aliases/ComposedGeneralDecryptResult.md) | A General JWE decryption result with header suggestions from the selected algorithms. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeGeneralDecrypt](functions/composeGeneralDecrypt.md) | Composes a General JWE decryptor from the selected JWE algorithm factories. |

## References

### ComposedDecryptOptions

Re-exports [ComposedDecryptOptions](../../../jwt/decrypt/type-aliases/ComposedDecryptOptions.md)

***

### ComposedJWEHeader

Re-exports [ComposedJWEHeader](../../flattened/encrypt/interfaces/ComposedJWEHeader.md)
