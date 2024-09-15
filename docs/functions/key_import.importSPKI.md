# Function: importSPKI

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **importSPKI**\<`KeyLikeType`\>(`spki`, `alg`, `options?`): [`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType`\>

Imports a PEM-encoded SPKI string as a runtime-specific public key representation
([KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) or [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey)).

Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
[Web Cryptography API](https://w3c.github.io/webcrypto/), use the OID rsaEncryption
(1.2.840.113549.1.1.1) instead for all RSA algorithms.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/key/import'`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `KeyLikeType` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spki` | `string` | PEM-encoded SPKI string |
| `alg` | `string` | (Only effective in Web Crypto API runtimes) JSON Web Algorithm identifier to be used with the imported key, its presence is only enforced in Web Crypto API runtimes. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`PEMImportOptions`](../interfaces/key_import.PEMImportOptions.md) | - |

#### Returns

[`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType`\>

**`Example`**

```js
const algorithm = 'ES256'
const spki = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
-----END PUBLIC KEY-----`
const ecPublicKey = await jose.importSPKI(spki, algorithm)
```
