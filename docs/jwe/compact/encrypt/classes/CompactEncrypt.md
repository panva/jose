# Class: CompactEncrypt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

The CompactEncrypt class is used to build and encrypt Compact JWE strings.

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

### new CompactEncrypt()

▸ **new CompactEncrypt**(`plaintext`): [`CompactEncrypt`](CompactEncrypt.md)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

[`CompactEncrypt`](CompactEncrypt.md)

## Methods

### encrypt()

▸ **encrypt**(`key`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Encrypts and resolves the value of the Compact JWE string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) | Public Key or Secret to encrypt the JWE with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options`? | [`EncryptOptions`](../../../../types/interfaces/EncryptOptions.md) | JWE Encryption options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

***

### ~~setContentEncryptionKey()~~

▸ **setContentEncryptionKey**(`cek`): `this`

Sets a content encryption key to use, by default a random suitable one is generated for the JWE
enc" (Encryption Algorithm) Header Parameter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cek` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Content Encryption Key. |

#### Returns

`this`

#### Deprecated

You should not use this method. It is only really intended for test and vector
  validation purposes.

***

### ~~setInitializationVector()~~

▸ **setInitializationVector**(`iv`): `this`

Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
one is generated for the JWE enc" (Encryption Algorithm) Header Parameter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iv` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Initialization Vector. |

#### Returns

`this`

#### Deprecated

You should not use this method. It is only really intended for test and vector
  validation purposes.

***

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `this`

Sets the JWE Key Management parameters to be used when encrypting the Content Encryption Key.
You do not need to invoke this method, it is only really intended for test and vector
validation purposes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

`this`

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the JWE Protected Header on the CompactEncrypt object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`CompactJWEHeaderParameters`](../../../../types/interfaces/CompactJWEHeaderParameters.md) | JWE Protected Header object. |

#### Returns

`this`
