# Function: calculateJwkThumbprintUri()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **calculateJwkThumbprintUri**(`key`, `digestAlgorithm`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Calculates a JSON Web Key (JWK) Thumbprint URI

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jwk/thumbprint'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md) | Key to calculate the thumbprint for. |
| `digestAlgorithm`? | `"sha256"` \| `"sha384"` \| `"sha512"` | Digest Algorithm to use for calculating the thumbprint. Default is "sha256". |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

## Example

```js
const thumbprintUri = await jose.calculateJwkThumbprintUri({
  kty: 'EC',
  crv: 'P-256',
  x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
  y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
})

console.log(thumbprintUri)
// 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:w9eYdC6_s_tLQ8lH6PUpc0mddazaqtPgeC2IgWDiqY8'
```

## See

[RFC9278](https://www.rfc-editor.org/rfc/rfc9278)
