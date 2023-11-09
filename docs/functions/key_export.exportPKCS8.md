# Function: exportPKCS8

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **exportPKCS8**(`key`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`string`\>

Exports a runtime-specific private key representation (KeyObject or CryptoKey) to a PEM-encoded
PKCS8 string format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Key representation to transform to a PEM-encoded PKCS8 string format. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`string`\>

**`Example`**

```js
const pkcs8Pem = await jose.exportPKCS8(privateKey)

console.log(pkcs8Pem)
```
