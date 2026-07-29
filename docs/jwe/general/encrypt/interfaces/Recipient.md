# Interface: Recipient

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build General JWE object's individual recipients.

## Methods

### addRecipient()

▸ **addRecipient**(`key`, `options?`): `Recipient`

A shorthand for calling [addRecipient()](../classes/GeneralEncrypt.md#addrecipient) on the enclosing
[GeneralEncrypt](../classes/GeneralEncrypt.md) instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public Key or Secret to encrypt the Content Encryption Key for the recipient with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`CritOption`](../../../../types/interfaces/CritOption.md) | JWE Encryption options. |

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

▸ **encrypt**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

A shorthand for calling [encrypt()](../classes/GeneralEncrypt.md#encrypt) on the enclosing
[GeneralEncrypt](../classes/GeneralEncrypt.md) instance. Takes no arguments — each recipient's key is supplied to
[addRecipient](#addrecipient).

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

***

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `Recipient`

Sets the JWE Key Management parameters to be used when encrypting. For ECDH based algorithms,
use this method to set the "apu" (Agreement PartyUInfo) or "apv" (Agreement PartyVInfo)
parameters.

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
