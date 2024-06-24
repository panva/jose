# Function: exportSPKI()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **exportSPKI**(`key`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Exports a runtime-specific public key representation ([KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) or [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey)) to
a PEM-encoded SPKI string format.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/key/export'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyLike`](../../../types/type-aliases/KeyLike.md) | Key representation to transform to a PEM-encoded SPKI string format. |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

## Example

```js
const spkiPem = await jose.exportSPKI(publicKey)

console.log(spkiPem)
```
