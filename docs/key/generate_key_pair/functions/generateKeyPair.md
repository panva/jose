# Function: generateKeyPair()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **generateKeyPair**(`alg`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GenerateKeyPairResult`](../interfaces/GenerateKeyPairResult.md)\>

Generates a private and a public key for a given JWA algorithm identifier. This can only generate
asymmetric key pairs. For symmetric secrets use the `generateSecret` function.

Note: The `privateKey` is generated with `extractable` set to `false` by default. See
[GenerateKeyPairOptions.extractable](../interfaces/GenerateKeyPairOptions.md#extractable) to generate an extractable `privateKey`.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/generate/keypair'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `alg` | `string` | JWA Algorithm Identifier to be used with the generated key pair. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options`? | [`GenerateKeyPairOptions`](../interfaces/GenerateKeyPairOptions.md) | Additional options passed down to the key pair generation. |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GenerateKeyPairResult`](../interfaces/GenerateKeyPairResult.md)\>

## Example

```js
const { publicKey, privateKey } = await jose.generateKeyPair('PS256')
console.log(publicKey)
console.log(privateKey)
```
