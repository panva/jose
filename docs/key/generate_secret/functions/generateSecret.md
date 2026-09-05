# Function: generateSecret()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **generateSecret**\<`Alg`\>(`alg`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneratedSecret`](../type-aliases/GeneratedSecret.md)\<`Alg`\>\>

Generates a symmetric secret key for a given JWA algorithm identifier.

> [!NOTE]\
> The secret key is generated with `extractable` set to `false` by default.

> [!NOTE]\
> A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512 return [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) because these secrets
> have no CryptoKey representation.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/key/generate/secret'`.

## Type Parameters

| Type Parameter |
| ------ |
| `Alg` *extends* `string` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `alg` | `Alg` | JWA Algorithm Identifier to be used with the generated secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`GenerateSecretOptions`](../interfaces/GenerateSecretOptions.md) | Additional options passed down to the secret generation. |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneratedSecret`](../type-aliases/GeneratedSecret.md)\<`Alg`\>\>

## Example

```js
const secret = await jose.generateSecret('HS256')
console.log(secret)
```
