# Class: CompactEncrypt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Builds and encrypts Compact JWE strings.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jwe/compact/encrypt'`.

## Example

```js
const jwe = await new jose.CompactEncrypt(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
  .encrypt(publicKey)

console.log(jwe)
```

## Constructors

### Constructor

▸ **new CompactEncrypt**(`plaintext`): `CompactEncrypt`

Creates a Compact JWE encryptor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

`CompactEncrypt`

## Methods

### encrypt()

▸ **encrypt**(`key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Encrypts the plaintext as a Compact JWE.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`EncryptOptions`](../../../../types/interfaces/EncryptOptions.md) | JWE Encryption options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

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
| `protectedHeader` | [`CompactJWEHeaderParameters`](../../../../types/interfaces/CompactJWEHeaderParameters.md) | JWE Protected Header object. |

#### Returns

`this`
