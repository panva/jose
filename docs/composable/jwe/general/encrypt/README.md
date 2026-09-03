# composable/jwe/general/encrypt

Composable General JWE encryption.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedGeneralEncrypt](interfaces/ComposedGeneralEncrypt.md) | A General JWE encryptor whose headers suggest the selected algorithms. |
| [ComposedGeneralEncryptConstructor](interfaces/ComposedGeneralEncryptConstructor.md) | Constructor for a General JWE encryptor with the selected header type. |
| [ComposedGeneralEncryptRecipient](interfaces/ComposedGeneralEncryptRecipient.md) | Used to build a General JWE object's individual recipients. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeGeneralEncrypt](functions/composeGeneralEncrypt.md) | Composes a General JWE encryptor class from the selected JWE algorithm factories. |

## References

### ComposedJWEHeader

Re-exports [ComposedJWEHeader](../../flattened/encrypt/interfaces/ComposedJWEHeader.md)
