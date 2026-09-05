# Function: importX509()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **importX509**(`x509`, `alg`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

Imports a PEM-encoded X.509 certificate's public key as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey).

> [!NOTE]\
> For RSA keys, use the rsaEncryption OID (1.2.840.113549.1.1.1). The id-RSASSA-PSS OID
> (1.2.840.113549.1.1.10) is not supported by the Web Cryptography API.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/key/import'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x509` | `string` | X.509 certificate string |
| `alg` | `string` | JSON Web Algorithm identifier to be used with the imported key. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`KeyImportOptions`](../interfaces/KeyImportOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

## Example

```js
const algorithm = 'ES256'
const x509 = `-----BEGIN CERTIFICATE-----
MIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np
QXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw
OTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN
VWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI
KoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35
UH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA
1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh
v+A1QWZMuTWqYt+uh/YSRNDn
-----END CERTIFICATE-----`
const ecPublicKey = await jose.importX509(x509, algorithm)
```
