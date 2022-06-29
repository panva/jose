# Function: exportSPKI

[💗 Help the project](https://github.com/sponsors/panva)

▸ **exportSPKI**(`key`): `Promise`<`string`\>

Exports a runtime-specific public key representation (KeyObject or CryptoKey) to a PEM-encoded
SPKI string format.

**`example`** Usage

```js
const spkiPem = await jose.exportSPKI(publicKey)

console.log(spkiPem)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Key representation to transform to a PEM-encoded SPKI string format. |

#### Returns

`Promise`<`string`\>
