# Function: importSPKI()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **importSPKI**(`spki`, `alg`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](../../../types/type-aliases/CryptoKey.md)\>

Imports a PEM-encoded SPKI string as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey).

Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
[Web Cryptography API](https://w3c.github.io/webcrypto/), use the OID rsaEncryption
(1.2.840.113549.1.1.1) instead for all RSA algorithms.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/key/import'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `spki` | `string` | PEM-encoded SPKI string |
| `alg` | `string` | JSON Web Algorithm identifier to be used with the imported key. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options`? | [`PEMImportOptions`](../interfaces/PEMImportOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](../../../types/type-aliases/CryptoKey.md)\>

## Example

```js
const algorithm = 'ES256'
const spki = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
-----END PUBLIC KEY-----`
const ecPublicKey = await jose.importSPKI(spki, algorithm)
```
