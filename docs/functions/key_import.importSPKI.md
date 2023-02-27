# Function: importSPKI

[💗 Help the project](https://github.com/sponsors/panva)

▸ **importSPKI**<`T`\>(`spki`, `alg`, `options?`): `Promise`<`T`\>

Imports a PEM-encoded SPKI string as a runtime-specific public key representation (KeyObject or
CryptoKey). See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210) to learn
about key to algorithm requirements and mapping.

**`example`** Usage

```js
const algorithm = 'ES256'
const spki = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
-----END PUBLIC KEY-----`
const ecPublicKey = await jose.importSPKI(spki, algorithm)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spki` | `string` | - |
| `alg` | `string` | (Only effective in Web Crypto API runtimes) JSON Web Algorithm identifier to be used with the imported key, its presence is only enforced in Web Crypto API runtimes. |
| `options?` | [`PEMImportOptions`](../interfaces/key_import.PEMImportOptions.md) | - |

#### Returns

`Promise`<`T`\>
