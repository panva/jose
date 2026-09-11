# Class: GeneralEncrypt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Produces general JWE JSON Serialization using authenticated encryption.

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

Creates an encryptor for general JWE JSON Serialization.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

`GeneralEncrypt`

## Methods

### addRecipient()

▸ **addRecipient**(`key`, `options?`): [`Recipient`](../interfaces/Recipient.md)

Adds a recipient and returns its configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`CritOption`](../../../../types/interfaces/CritOption.md) | JWE Encryption options. |

#### Returns

[`Recipient`](../interfaces/Recipient.md)

***

### encrypt()

▸ **encrypt**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

Encrypts the plaintext and returns the general JWE JSON Serialization.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWE`](../../../../types/interfaces/GeneralJWE.md)\>

***

### setAdditionalAuthenticatedData()

▸ **setAdditionalAuthenticatedData**(`aad`): `this`

Sets the JWE AAD, which is integrity protected but not encrypted.

Its base64url encoding is combined with the Encoded Protected Header to form the Additional
Authenticated Data encryption parameter. See
[draft-ietf-jose-hpke-encrypt-22, Section 7.1, step 15](https://www.ietf.org/archive/id/draft-ietf-jose-hpke-encrypt-22.html#section-7.1).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aad` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Additional Authenticated Data (JWE AAD). |

#### Returns

`this`

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the JWE Protected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Protected Header object. |

#### Returns

`this`

***

### setSharedUnprotectedHeader()

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`): `this`

Sets the JWE Shared Unprotected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sharedUnprotectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Shared Unprotected Header object. |

#### Returns

`this`
