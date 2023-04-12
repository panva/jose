# Function: generateSecret

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **generateSecret**<`T`\>(`alg`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`T` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )\>

Generates a symmetric secret key for a given JWA algorithm identifier.

Note: Under Web Crypto API runtime the secret key is generated with `extractable` set to `false`
by default.

**`example`** Usage

```js
const secret = await jose.generateSecret('HS256')
console.log(secret)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `alg` | `string` | JWA Algorithm Identifier to be used with the generated secret. |
| `options?` | [`GenerateSecretOptions`](../interfaces/key_generate_secret.GenerateSecretOptions.md) | Additional options passed down to the secret generation. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`T` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )\>
