# Interface: GetKeyFunction\<T, T2>

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

## Type parameters

Name |
------ |
`T` |
`T2` |

## Callable

▸ (`protectedHeader`: T, `token`: T2): Promise\<[KeyLike](../types/_types_d_.keylike.md)>

*Defined in [src/types.d.ts:79](https://github.com/panva/jose/blob/v3.5.0/src/types.d.ts#L79)*

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | T | JWE or JWS Protected Header. |
`token` | T2 | The consumed JWE or JWS token.  |

**Returns:** Promise\<[KeyLike](../types/_types_d_.keylike.md)>
