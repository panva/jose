# Function: generateSecret()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **generateSecret**(`alg`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

Generates a symmetric secret key for a given JWA algorithm identifier.

Note: The secret key is generated with `extractable` set to `false` by default.

Note: Because A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512 secrets cannot be represented as
[CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) this method yields a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for them instead.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/generate/secret'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `alg` | `string` | JWA Algorithm Identifier to be used with the generated secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options`? | [`GenerateSecretOptions`](../interfaces/GenerateSecretOptions.md) | Additional options passed down to the secret generation. |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

## Example

```js
const secret = await jose.generateSecret('HS256')
console.log(secret)
```
