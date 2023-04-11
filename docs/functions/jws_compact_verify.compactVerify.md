# Function: compactVerify

[💗 Help the project](https://github.com/sponsors/panva)

▸ **compactVerify**(`jws`, `key`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md)\>

Verifies the signature and format of and afterwards decodes the Compact JWS.

**`example`** Usage

```js
const jws =
  'eyJhbGciOiJFUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.kkAs_gPPxWMI3rHuVlxHaTPfDWDoqdI8jSvuSmqV-8IHIWXg9mcAeC9ggV-45ZHRbiRJ3obUIFo1rHphPA5URg'

const { payload, protectedHeader } = await jose.compactVerify(jws, publicKey)

console.log(protectedHeader)
console.log(new TextDecoder().decode(payload))
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | Compact JWS. |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Key to verify the JWS with. See also [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md)\>

▸ **compactVerify**<`T`\>(`jws`, `getKey`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | Compact JWS. |
| `getKey` | [`CompactVerifyGetKey`](../interfaces/jws_compact_verify.CompactVerifyGetKey.md) | Function resolving a key to verify the JWS with. See also [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`T`\>\>
