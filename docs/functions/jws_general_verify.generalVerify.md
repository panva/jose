# Function: generalVerify

[💗 Help the project](https://github.com/sponsors/panva)

▸ **generalVerify**(`jws`, `key`, `options?`): `Promise`<[`GeneralVerifyResult`](../interfaces/types.GeneralVerifyResult.md)\>

Verifies the signature and format of and afterwards decodes the General JWS.

**`example`** Usage

```js
const jws = {
  payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
  signatures: [
    {
      signature:
        'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
      protected: 'eyJhbGciOiJFUzI1NiJ9',
    },
  ],
}

const { payload, protectedHeader } = await jose.generalVerify(jws, publicKey)

console.log(protectedHeader)
console.log(new TextDecoder().decode(payload))
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | [`GeneralJWSInput`](../interfaces/types.GeneralJWSInput.md) | General JWS. |
| `key` | `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) | Key to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`GeneralVerifyResult`](../interfaces/types.GeneralVerifyResult.md)\>

▸ **generalVerify**(`jws`, `getKey`, `options?`): `Promise`<[`GeneralVerifyResult`](../interfaces/types.GeneralVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | [`GeneralJWSInput`](../interfaces/types.GeneralJWSInput.md) | General JWS. |
| `getKey` | [`GeneralVerifyGetKey`](../interfaces/jws_general_verify.GeneralVerifyGetKey.md) | Function resolving a key to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`GeneralVerifyResult`](../interfaces/types.GeneralVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
