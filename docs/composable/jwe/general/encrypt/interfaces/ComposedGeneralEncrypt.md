# Interface: ComposedGeneralEncrypt\<Header\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A General JWE encryptor whose headers suggest the selected algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Header` *extends* [`JWEHeaderParameters`](../../../../../types/interfaces/JWEHeaderParameters.md) |

## Methods

### addRecipient()

▸ **addRecipient**(`key`, `options?`): [`ComposedGeneralEncryptRecipient`](ComposedGeneralEncryptRecipient.md)\<`Header`\>

Adds an additional recipient for the General JWE object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../../types/type-aliases/KeyInput.md) | Public Key or Secret to encrypt the Content Encryption Key for the recipient with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`CritOption`](../../../../../types/interfaces/CritOption.md) | JWE Encryption options. |

#### Returns

[`ComposedGeneralEncryptRecipient`](ComposedGeneralEncryptRecipient.md)\<`Header`\>

***

### encrypt()

▸ **encrypt**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md)\>

Encrypts and resolves the value of the General JWE object.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md)\>

***

### setAdditionalAuthenticatedData()

▸ **setAdditionalAuthenticatedData**(`aad`): `this`

Sets the Additional Authenticated Data on the JWE producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aad` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Additional Authenticated Data. |

#### Returns

`this`

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the Protected Header on the JWS, JWE, or JWT producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | `Header` | JOSE Protected Header accepted by this producer. |

#### Returns

`this`

***

### setSharedUnprotectedHeader()

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`): `this`

Sets the JWE Shared Unprotected Header on the producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sharedUnprotectedHeader` | `Header` | JWE Shared Unprotected Header. |

#### Returns

`this`
