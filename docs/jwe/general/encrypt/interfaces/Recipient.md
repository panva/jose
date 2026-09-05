# Interface: Recipient

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Configures an individual recipient in a General JWE.

## Methods

### addRecipient()

▸ **addRecipient**(`key`, `options?`): `Recipient`

Adds another recipient to the enclosing [GeneralEncrypt](../classes/GeneralEncrypt.md) and returns its configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`CritOption`](../../../../types/interfaces/CritOption.md) | JWE Encryption options. |

#### Returns

`Recipient`

***

### done()

▸ **done**(): [`GeneralEncrypt`](../classes/GeneralEncrypt.md)

Returns the enclosing [GeneralEncrypt](../classes/GeneralEncrypt.md) instance.

#### Returns

[`GeneralEncrypt`](../classes/GeneralEncrypt.md)

***

### encrypt()

▸ **encrypt**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

Encrypts for all recipients on the enclosing [GeneralEncrypt](../classes/GeneralEncrypt.md), using their configured
keys.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

***

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `Recipient`

Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
of header setters; the resulting parameters are added to the JOSE header. May only be called
once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

`Recipient`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `Recipient`

Sets the JWE Per-Recipient Unprotected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Per-Recipient Unprotected Header. |

#### Returns

`Recipient`
