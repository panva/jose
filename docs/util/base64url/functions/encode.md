# Function: encode()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **encode**(`input`): `string`

Encodes unpadded base64url; strings are first encoded as UTF-8.

These functions are exported (as the `base64url` namespace) from the main `'jose'` module entry
point as well as from its subpath export `'jose/base64url'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Bytes or a string to encode. Strings are first encoded as UTF-8. |

## Returns

`string`

The unpadded base64url representation of the input.

## Example

```js
const encoded = jose.base64url.encode('Hello World!')
```
