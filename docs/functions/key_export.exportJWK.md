# Function: exportJWK

[💗 Help the project](https://github.com/sponsors/panva)

▸ **exportJWK**(`key`): `Promise`<[`JWK`](../interfaces/types.JWK.md)\>

Exports a runtime-specific key representation (KeyLike) to a JWK.

**`example`** Usage

```js
const privateJwk = await jose.exportJWK(privateKey)
const publicJwk = await jose.exportJWK(publicKey)

console.log(privateJwk)
console.log(publicJwk)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) | Key representation to export as JWK. |

#### Returns

`Promise`<[`JWK`](../interfaces/types.JWK.md)\>
