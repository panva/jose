# Function: encode()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **encode**(`input`): `string`

Encodes input using unpadded base64url.

These functions are exported (as the `base64url` namespace) from the main `'jose'` module entry
point as well as from its subpath export `'jose/base64url'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Input to encode, as a string or as bytes. Strings are encoded as UTF-8 first. |

## Returns

`string`

The Base64URL encoded, unpadded, representation of the input.

## Example

```js
const encoded = jose.base64url.encode('Hello World!')
```
