# Interface: CompactDecryptGetKey

[jwe/compact/decrypt](../modules/jwe_compact_decrypt.md).CompactDecryptGetKey

## Hierarchy

- [`GetKeyFunction`](types.getkeyfunction.md)<[`JWEHeaderParameters`](types.jweheaderparameters.md), [`FlattenedJWE`](types.flattenedjwe.md)\>

  ↳ **`CompactDecryptGetKey`**

## Callable

### CompactDecryptGetKey

▸ **CompactDecryptGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.keylike.md)\>

Interface for Compact JWE Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](types.jweheaderparameters.md) |
| `token` | [`FlattenedJWE`](types.flattenedjwe.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.keylike.md)\>

#### Defined in

[types.d.ts:80](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L80)
