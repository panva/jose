# Interface: ComposedGeneralEncryptRecipient\<Header\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build a General JWE object's individual recipients.

## Type Parameters

| Type Parameter |
| ------ |
| `Header` *extends* [`JWEHeaderParameters`](../../../../../types/interfaces/JWEHeaderParameters.md) |

## Methods

### addRecipient()

▸ **addRecipient**(`key`, `options?`): `ComposedGeneralEncryptRecipient`\<`Header`\>

A shorthand for calling [addRecipient()](ComposedGeneralEncrypt.md#addrecipient) on the
enclosing GeneralEncrypt instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../../types/type-aliases/KeyInput.md) | Public Key or Secret to encrypt the Content Encryption Key for the recipient with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`CritOption`](../../../../../types/interfaces/CritOption.md) | JWE Encryption options. |

#### Returns

`ComposedGeneralEncryptRecipient`\<`Header`\>

***

### done()

▸ **done**(): [`ComposedGeneralEncrypt`](ComposedGeneralEncrypt.md)\<`Header`\>

Returns the enclosing GeneralEncrypt instance.

#### Returns

[`ComposedGeneralEncrypt`](ComposedGeneralEncrypt.md)\<`Header`\>

***

### encrypt()

▸ **encrypt**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md)\>

A shorthand for calling `encrypt()` on the enclosing `GeneralEncrypt` instance. Takes no
arguments — each recipient's key is supplied to `addRecipient()`.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md)\>

***

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `this`

Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
appropriate JOSE Header.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

`this`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `this`

Sets the JWS Unprotected Header or JWE Per-Recipient Unprotected Header on the producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | `Header` | JWS Unprotected Header or JWE Per-Recipient Unprotected Header. |

#### Returns

`this`
