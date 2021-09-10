# Class: FlattenedEncrypt

[jwe/flattened/encrypt](../modules/jwe_flattened_encrypt.md).FlattenedEncrypt

The FlattenedEncrypt class is a utility for creating Flattened JWE
objects.

**`example`** ESM import
```js
import { FlattenedEncrypt } from 'jose/jwe/flattened/encrypt'
```

**`example`** CJS import
```js
const { FlattenedEncrypt } = require('jose/jwe/flattened/encrypt')
```

**`example`** Deno import
```js
import { FlattenedEncrypt } from 'https://deno.land/x/jose@v3.17.0/jwe/flattened/encrypt.ts'
```

**`example`** Usage
```js
const encoder = new TextEncoder()

const jwe = await new FlattenedEncrypt(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
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

#### Defined in

[jwe/flattened/encrypt.ts:75](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L75)

## Methods

### encrypt

▸ **encrypt**(`key`, `options?`): `Promise`<[`FlattenedJWE`](../interfaces/types.FlattenedJWE.md)\>

Encrypts and resolves the value of the Flattened JWE object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Public Key or Secret to encrypt the JWE with. |
| `options?` | [`EncryptOptions`](../interfaces/types.EncryptOptions.md) | JWE Encryption options. |

#### Returns

`Promise`<[`FlattenedJWE`](../interfaces/types.FlattenedJWE.md)\>

#### Defined in

[jwe/flattened/encrypt.ts:185](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L185)

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

#### Defined in

[jwe/flattened/encrypt.ts:142](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L142)

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets a content encryption key to use, by default a random suitable one
is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
You do not need to invoke this method, it is only really intended for
test and vector validation purposes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cek` | `Uint8Array` | JWE Content Encryption Key. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

#### Defined in

[jwe/flattened/encrypt.ts:155](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L155)

___

### setInitializationVector

▸ **setInitializationVector**(`iv`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Initialization Vector to use for content encryption, by default
a random suitable one is generated for the JWE enc" (Encryption Algorithm)
Header Parameter. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iv` | `Uint8Array` | JWE Initialization Vector. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

#### Defined in

[jwe/flattened/encrypt.ts:171](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L171)

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`): [`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

Sets the JWE Key Management parameters to be used when encrypting.
Use of this is method is really only needed for ECDH-ES based algorithms
when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
Other parameters will always be randomly generated when needed and missing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../interfaces/types.JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

[`FlattenedEncrypt`](jwe_flattened_encrypt.FlattenedEncrypt.md)

#### Defined in

[jwe/flattened/encrypt.ts:90](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L90)

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

#### Defined in

[jwe/flattened/encrypt.ts:103](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L103)

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

#### Defined in

[jwe/flattened/encrypt.ts:116](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L116)

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

#### Defined in

[jwe/flattened/encrypt.ts:129](https://github.com/panva/jose/blob/v3.17.0/src/jwe/flattened/encrypt.ts#L129)
