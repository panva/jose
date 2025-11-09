# Interface: Recipient

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build General JWE object's individual recipients.

## Methods

### addRecipient()

▸ **addRecipient**(...`args`): `Recipient`

A shorthand for calling addRecipient() on the enclosing [GeneralEncrypt](../classes/GeneralEncrypt.md) instance

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | \[[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md), [`CritOption`](../../../../types/interfaces/CritOption.md)\] |

#### Returns

`Recipient`

***

### done()

▸ **done**(): [`GeneralEncrypt`](../classes/GeneralEncrypt.md)

Returns the enclosing [GeneralEncrypt](../classes/GeneralEncrypt.md) instance

#### Returns

[`GeneralEncrypt`](../classes/GeneralEncrypt.md)

***

### encrypt()

▸ **encrypt**(...`args`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

A shorthand for calling encrypt() on the enclosing [GeneralEncrypt](../classes/GeneralEncrypt.md) instance

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | \[\] |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

***

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `Recipient`

Sets the JWE Key Management parameters to be used when encrypting.

(ECDH-ES) Use of this method is needed for ECDH based algorithms to set the "apu" (Agreement
PartyUInfo) or "apv" (Agreement PartyVInfo) parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

`Recipient`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `Recipient`

Sets the JWE Per-Recipient Unprotected Header on the Recipient object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Per-Recipient Unprotected Header. |

#### Returns

`Recipient`
