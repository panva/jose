# Function: generateKeyPair

[💗 Help the project](https://github.com/sponsors/panva)

▸ **generateKeyPair**<`T`\>(`alg`, `options?`): `Promise`<[`GenerateKeyPairResult`](../interfaces/key_generate_key_pair.GenerateKeyPairResult.md)<`T`\>\>

Generates a private and a public key for a given JWA algorithm identifier. This can only generate
asymmetric key pairs. For symmetric secrets use the `generateSecret` function.

Note: Under Web Crypto API runtime the `privateKey` is generated with `extractable` set to
`false` by default.

**`example`** Usage

```js
const { publicKey, privateKey } = await jose.generateKeyPair('PS256')
console.log(publicKey)
console.log(privateKey)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `alg` | `string` | JWA Algorithm Identifier to be used with the generated key pair. |
| `options?` | [`GenerateKeyPairOptions`](../interfaces/key_generate_key_pair.GenerateKeyPairOptions.md) | Additional options passed down to the key pair generation. |

#### Returns

`Promise`<[`GenerateKeyPairResult`](../interfaces/key_generate_key_pair.GenerateKeyPairResult.md)<`T`\>\>
