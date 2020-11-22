# Interface: GetKeyFunction\<T, T2>

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

## Type parameters

Name |
------ |
`T` |
`T2` |

## Callable

▸ (`protectedHeader`: T, `token`: T2): Promise\<[KeyLike](../types/_types_d_.keylike.md)>

*Defined in [src/types.d.ts:75](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L75)*

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | T | JWE or JWS Protected Header. |
`token` | T2 | The consumed JWE or JWS token.  |

**Returns:** Promise\<[KeyLike](../types/_types_d_.keylike.md)>
