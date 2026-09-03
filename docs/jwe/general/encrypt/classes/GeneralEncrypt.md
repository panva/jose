# Class: GeneralEncrypt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

The GeneralEncrypt class is used to build and encrypt General JWE objects.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jwe/general/encrypt'`.

## Example

```js
const jwe = await new jose.GeneralEncrypt(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .setProtectedHeader({ enc: 'A256GCM' })
  .addRecipient(ecPublicKey)
  .setUnprotectedHeader({ alg: 'ECDH-ES+A256KW' })
  .addRecipient(rsaPublicKey)
  .setUnprotectedHeader({ alg: 'RSA-OAEP-384' })
  .encrypt()

console.log(jwe)
```

## Constructors

### Constructor

▸ **new GeneralEncrypt**(`plaintext`): `GeneralEncrypt`

GeneralEncrypt constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

`GeneralEncrypt`

## Methods

### addRecipient()

▸ **addRecipient**(`key`, `options?`): [`Recipient`](../interfaces/Recipient.md)

Adds an additional recipient for the General JWE object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public Key or Secret to encrypt the Content Encryption Key for the recipient with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`CritOption`](../../../../types/interfaces/CritOption.md) | JWE Encryption options. |

#### Returns

[`Recipient`](../interfaces/Recipient.md)

***

### encrypt()

▸ **encrypt**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

Encrypts and resolves the value of the General JWE object.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

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
| `protectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JOSE Protected Header accepted by this producer. |

#### Returns

`this`

***

### setSharedUnprotectedHeader()

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`): `this`

Sets the JWE Shared Unprotected Header on the producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sharedUnprotectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Shared Unprotected Header. |

#### Returns

`this`
