# Interface: Recipient

[💗 Help the project](https://github.com/sponsors/panva)

## Table of contents

### Methods

- [addRecipient](jwe_general_encrypt.Recipient.md#addrecipient)
- [done](jwe_general_encrypt.Recipient.md#done)
- [encrypt](jwe_general_encrypt.Recipient.md#encrypt)
- [setUnprotectedHeader](jwe_general_encrypt.Recipient.md#setunprotectedheader)

## Methods

### addRecipient

▸ **addRecipient**(...`args`): [`Recipient`](jwe_general_encrypt.Recipient.md)

A shorthand for calling addRecipient() on the enclosing GeneralEncrypt instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [key: Uint8Array \| KeyLike, options?: CritOption] |

#### Returns

[`Recipient`](jwe_general_encrypt.Recipient.md)

___

### done

▸ **done**(): [`GeneralEncrypt`](../classes/jwe_general_encrypt.GeneralEncrypt.md)

Returns the enclosing GeneralEncrypt

#### Returns

[`GeneralEncrypt`](../classes/jwe_general_encrypt.GeneralEncrypt.md)

___

### encrypt

▸ **encrypt**(...`args`): `Promise`<[`GeneralJWE`](types.GeneralJWE.md)\>

A shorthand for calling encrypt() on the enclosing GeneralEncrypt instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [options?: DeflateOption] |

#### Returns

`Promise`<[`GeneralJWE`](types.GeneralJWE.md)\>

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`): [`Recipient`](jwe_general_encrypt.Recipient.md)

Sets the JWE Per-Recipient Unprotected Header on the Recipient object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `unprotectedHeader` | [`JWEHeaderParameters`](types.JWEHeaderParameters.md) | JWE Per-Recipient Unprotected Header. |

#### Returns

[`Recipient`](jwe_general_encrypt.Recipient.md)
