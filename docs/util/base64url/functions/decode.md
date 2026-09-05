# Function: decode()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **decode**(`input`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Decodes base64url text or its UTF-8 bytes.

These functions are exported (as the `base64url` namespace) from the main `'jose'` module entry
point as well as from its subpath export `'jose/base64url'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Base64url-encoded string or its UTF-8 bytes. |

## Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The decoded bytes.

## Example

```js
const decoded = jose.base64url.decode('SGVsbG8gV29ybGQh')
```

## Throws

If the input is not valid base64url. Standard Base64 `+` and `/` are
  rejected.
