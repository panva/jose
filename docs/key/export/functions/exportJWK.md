# Function: exportJWK()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **exportJWK**(`key`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../types/interfaces/JWK.md)\>

Exports a runtime-specific key representation (KeyLike) to a JWK.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/key/export'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../../../types/type-aliases/KeyLike.md) | Key representation to export as JWK. |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../types/interfaces/JWK.md)\>

## Example

```js
const privateJwk = await jose.exportJWK(privateKey)
const publicJwk = await jose.exportJWK(publicKey)

console.log(privateJwk)
console.log(publicJwk)
```
