# Function: calculateJwkThumbprint()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **calculateJwkThumbprint**(`key`, `digestAlgorithm?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Calculates a base64url-encoded JWK Thumbprint. CryptoKey inputs must be extractable.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jwk/thumbprint'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md) | Key to calculate the thumbprint for. |
| `digestAlgorithm?` | `"sha256"` \| `"sha384"` \| `"sha512"` | Digest algorithm. Defaults to "sha256". |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

## Example

```js
const thumbprint = await jose.calculateJwkThumbprint({
  kty: 'EC',
  crv: 'P-256',
  x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
  y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
})

console.log(thumbprint)
// 'w9eYdC6_s_tLQ8lH6PUpc0mddazaqtPgeC2IgWDiqY8'
```

## See

[RFC7638](https://www.rfc-editor.org/info/rfc7638/)
