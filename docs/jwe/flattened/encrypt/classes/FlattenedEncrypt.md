# Class: FlattenedEncrypt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Builds and encrypts Flattened JWE objects.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jwe/flattened/encrypt'`.

## Example

```js
const jwe = await new jose.FlattenedEncrypt(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
  .setAdditionalAuthenticatedData(new TextEncoder().encode('The Fellowship of the Ring'))
  .encrypt(publicKey)

console.log(jwe)
```

## Constructors

### Constructor

▸ **new FlattenedEncrypt**(`plaintext`): `FlattenedEncrypt`

Creates a Flattened JWE encryptor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

`FlattenedEncrypt`

## Methods

### encrypt()

▸ **encrypt**(`key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedJWE`](../../../../types/interfaces/FlattenedJWE.md)\>

Encrypts the plaintext as a Flattened JWE.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`EncryptOptions`](../../../../types/interfaces/EncryptOptions.md) | JWE Encryption options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedJWE`](../../../../types/interfaces/FlattenedJWE.md)\>

***

### setAdditionalAuthenticatedData()

▸ **setAdditionalAuthenticatedData**(`aad`): `this`

Sets additional data to authenticate without encrypting it.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aad` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Additional Authenticated Data. |

#### Returns

`this`

***

### ~~setContentEncryptionKey()~~

▸ **setContentEncryptionKey**(`cek`): `this`

Sets a content encryption key instead of generating a random one for the JWE "enc" algorithm.
May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cek` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Content Encryption Key. |

#### Returns

`this`

#### Deprecated

Use only for testing and vector validation.

***

### ~~setInitializationVector()~~

▸ **setInitializationVector**(`iv`): `this`

Sets the content encryption IV instead of generating a random one for the JWE "enc" algorithm.
May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iv` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Initialization Vector. |

#### Returns

`this`

#### Deprecated

Use only for testing and vector validation.

***

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `this`

Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
of header setters; the resulting parameters are added to the JOSE header. May only be called
once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

`this`

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the JWE Protected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Protected Header. |

#### Returns

`this`

***

### setSharedUnprotectedHeader()

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`): `this`

Sets the JWE Shared Unprotected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sharedUnprotectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Shared Unprotected Header. |

#### Returns

`this`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `this`

Sets the JWE Per-Recipient Unprotected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) | JWE Per-Recipient Unprotected Header. |

#### Returns

`this`
