# Function: exportPKCS8

[💗 Help the project](https://github.com/sponsors/panva)

▸ **exportPKCS8**(`key`): `Promise`<`string`\>

Exports a runtime-specific private key representation (KeyObject or CryptoKey) to a PEM-encoded PKCS8 string format.

**`example`** Usage
```js
const pkcs8Pem = await jose.exportPKCS8(privateKey)

console.log(pkcs8Pem)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Key representation to transform to a PEM-encoded PKCS8 string format. |

#### Returns

`Promise`<`string`\>
