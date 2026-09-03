# composable/jwe/flattened/decrypt

Composable Flattened JWE decryption.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedFlattenedDecryptFunction](interfaces/ComposedFlattenedDecryptFunction.md) | A Flattened JWE decryptor restricted to the selected algorithms. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ComposedFlattenedDecryptResult](type-aliases/ComposedFlattenedDecryptResult.md) | A Flattened JWE decryption result with header suggestions from the selected algorithms. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeFlattenedDecrypt](functions/composeFlattenedDecrypt.md) | Composes a Flattened JWE decryptor from the selected JWE algorithm factories. |

## References

### ComposedDecryptOptions

Re-exports [ComposedDecryptOptions](../../../jwt/decrypt/type-aliases/ComposedDecryptOptions.md)

***

### ComposedJWEHeader

Re-exports [ComposedJWEHeader](../encrypt/interfaces/ComposedJWEHeader.md)
