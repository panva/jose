# Class: GeneralEncrypt

[💗 Help the project](https://github.com/sponsors/panva)

The GeneralEncrypt class is a utility for creating General JWE objects.

**`example`** Usage

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

## Table of contents

### Constructors

- [constructor](jwe_general_encrypt.GeneralEncrypt.md#constructor)

### Methods

- [addRecipient](jwe_general_encrypt.GeneralEncrypt.md#addrecipient)
- [encrypt](jwe_general_encrypt.GeneralEncrypt.md#encrypt)
- [setAdditionalAuthenticatedData](jwe_general_encrypt.GeneralEncrypt.md#setadditionalauthenticateddata)
- [setProtectedHeader](jwe_general_encrypt.GeneralEncrypt.md#setprotectedheader)
- [setSharedUnprotectedHeader](jwe_general_encrypt.GeneralEncrypt.md#setsharedunprotectedheader)

## Constructors

### constructor

• **new GeneralEncrypt**(`plaintext`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `plaintext` | `Uint8Array` | Binary representation of the plaintext to encrypt. |

## Methods

### addRecipient

▸ **addRecipient**(`key`, `options?`): [`Recipient`](../interfaces/jwe_general_encrypt.Recipient.md)

Adds an additional recipient for the General JWE object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) | Public Key or Secret to encrypt the Content Encryption Key for the recipient with. |
| `options?` | [`CritOption`](../interfaces/types.CritOption.md) | JWE Encryption options. |

#### Returns

[`Recipient`](../interfaces/jwe_general_encrypt.Recipient.md)

___

### encrypt

▸ **encrypt**(`options?`): `Promise`<[`GeneralJWE`](../interfaces/types.GeneralJWE.md)\>

Encrypts and resolves the value of the General JWE object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`DeflateOption`](../interfaces/types.DeflateOption.md) | JWE Encryption options. |

#### Returns

`Promise`<[`GeneralJWE`](../interfaces/types.GeneralJWE.md)\>

___

### setAdditionalAuthenticatedData

▸ **setAdditionalAuthenticatedData**(`aad`): [`GeneralEncrypt`](jwe_general_encrypt.GeneralEncrypt.md)

Sets the Additional Authenticated Data on the GeneralEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aad` | `Uint8Array` | Additional Authenticated Data. |

#### Returns

[`GeneralEncrypt`](jwe_general_encrypt.GeneralEncrypt.md)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`GeneralEncrypt`](jwe_general_encrypt.GeneralEncrypt.md)

Sets the JWE Protected Header on the GeneralEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](../interfaces/types.JWEHeaderParameters.md) | JWE Protected Header object. |

#### Returns

[`GeneralEncrypt`](jwe_general_encrypt.GeneralEncrypt.md)

___

### setSharedUnprotectedHeader

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`): [`GeneralEncrypt`](jwe_general_encrypt.GeneralEncrypt.md)

Sets the JWE Shared Unprotected Header on the GeneralEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sharedUnprotectedHeader` | [`JWEHeaderParameters`](../interfaces/types.JWEHeaderParameters.md) | JWE Shared Unprotected Header object. |

#### Returns

[`GeneralEncrypt`](jwe_general_encrypt.GeneralEncrypt.md)
