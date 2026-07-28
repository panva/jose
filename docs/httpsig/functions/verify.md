# Function: verify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **verify**(`alg`, `key`, `signature`, `data`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Verifies an HTTP message signature for a given signature base, the `HTTP_VERIFY` primitive
defined in [RFC 9421 Section 3.3](https://www.rfc-editor.org/info/rfc9421/#section-3.3).

This function is exported (as a named export) from its subpath export `'jose/httpsig'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `alg` | `string` | An identifier from the IANA "HTTP Signature Algorithms" registry, or a JWS `alg` (Algorithm) Header Parameter value supported by `jose`. |
| `key` | [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | Public Key or Secret to verify with. |
| `signature` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The HTTP message signature to verify. |
| `data` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [The signature base](https://www.rfc-editor.org/info/rfc9421/#section-2.5). |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

## Example

```js
// The signature base is recreated by the application per RFC 9421 Section 2.5
const data = new TextEncoder().encode(
  '"@method": POST\n' +
    '"@authority": example.com\n' +
    '"@signature-params": ("@method" "@authority");created=1618884473;keyid="my-key"',
)

const valid = await httpsig.verify('ecdsa-p256-sha256', publicKey, signature, data)

console.log(valid)
```

## See

[RFC9421](https://www.rfc-editor.org/info/rfc9421/)
