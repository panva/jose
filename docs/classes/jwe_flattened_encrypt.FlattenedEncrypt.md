# Class: FlattenedEncrypt

[💗 Help the project](https://github.com/sponsors/panva)

The FlattenedEncrypt class is a utility for creating Flattened JWE objects.

**`example`** Usage

```js
const jwe = await new jose.FlattenedEncrypt(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
  .setAdditionalAuthenticatedData(encoder.encode('The Fellowship of the Ring'))
  .encrypt(publicKey)

console.log(jwe)
```

## Table of contents

### Constructors

- [constructor](jwe_flattened_encrypt.FlattenedEncrypt.md#constructor)

### Methods

- [encrypt](jwe_flattened_encrypt.FlattenedEncrypt.md#encrypt)
- [setAdditionalAuthenticatedData](jwe_flattened_encrypt.FlattenedEncrypt.md#setadditionalauthenticateddata)
- [setContentEncryptionKey](jwe_flattened_encrypt.FlattenedEncrypt.md#setcontentencryptionkey)
- [setInitializationVector](jwe_flattened_encrypt.FlattenedEncrypt.md#setinitializationvector)
- [setKeyManagementParameters](jwe_flattened_encrypt.FlattenedEncrypt.md#setkeymanagementparameters)
- [setProtectedHeader](jwe_flattened_encrypt.FlattenedEncrypt.md#setprotectedheader)
- [setSharedUnprotectedHeader](jwe_flattened_encrypt.FlattenedEncrypt.md#setsharedunprotectedheader)
- [setUnprotectedHeader](jwe_flattened_encrypt.FlattenedEncrypt.md#setunprotectedheader)

## Constructors

### constructor

• **new FlattenedEncrypt**(`plaintext`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `plaintext` | `Uint8Array` | Binary representation of the plaintext to encrypt. |

## Methods

### encrypt

▸ **encrypt**(`key`, `options?`): `Promise`<[`FlattenedJWE`](../interfaces/types.FlattenedJWE.md)\>

Encrypts and resolves the value of the Flattened JWE object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) | Public Key or Secret to encrypt the JWE with. |
| `options?` | [`EncryptOptions`](../interfaces/types.EncryptOptions.md) | JWE Encryption options. |

#### Returns

`Promise`<[`FlattenedJWE`](../interfaces/types.FlattenedJWE.md)\>

___

### setAdditionalAuthenticatedData

▸ **setAdditionalAuthenticatedData**(`aad`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the Additional Authenticated Data on the FlattenedEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aad` | `Uint8Array` | Additional Authenticated Data. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets a content encryption key to use, by default a random suitable one is generated for the JWE
enc" (Encryption Algorithm) Header Parameter.

**`deprecated`** You should not use this method. It is only really intended for test and vector
  validation purposes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cek` | `Uint8Array` | JWE Content Encryption Key. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

___

### setInitializationVector

▸ **setInitializationVector**(`iv`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
one is generated for the JWE enc" (Encryption Algorithm) Header Parameter.

**`deprecated`** You should not use this method. It is only really intended for test and vector
  validation purposes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iv` | `Uint8Array` | JWE Initialization Vector. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Key Management parameters to be used when encrypting. Use of this is method is
really only needed for ECDH based algorithms when utilizing the Agreement PartyUInfo or
Agreement PartyVInfo parameters. Other parameters will always be randomly generated when needed
and missing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../interfaces/types.JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Protected Header on the FlattenedEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](../interfaces/types.JWEHeaderParameters.md) | JWE Protected Header. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

___

### setSharedUnprotectedHeader

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sharedUnprotectedHeader` | [`JWEHeaderParameters`](../interfaces/types.JWEHeaderParameters.md) | JWE Shared Unprotected Header. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `unprotectedHeader` | [`JWEHeaderParameters`](../interfaces/types.JWEHeaderParameters.md) | JWE Per-Recipient Unprotected Header. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)
