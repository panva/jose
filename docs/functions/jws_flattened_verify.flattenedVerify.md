# Function: flattenedVerify

▸ **flattenedVerify**(`jws`, `key`, `options?`): `Promise`<[`FlattenedVerifyResult`](../interfaces/types.FlattenedVerifyResult.md)\>

Verifies the signature and format of and afterwards decodes the Flattened JWS.

**`example`** Usage
```js
const decoder = new TextDecoder()
const jws = {
  signature: 'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
  payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
  protected: 'eyJhbGciOiJFUzI1NiJ9'
}

const { payload, protectedHeader } = await flattenedVerify(jws, publicKey)

console.log(protectedHeader)
console.log(decoder.decode(payload))
```

**`example`** ESM import
```js
import { flattenedVerify } from 'jose'
```

**`example`** CJS import
```js
const { flattenedVerify } = require('jose')
```

**`example`** Deno import
```js
import { flattenedVerify } from 'https://deno.land/x/jose@v4.0.1/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md) | Flattened JWS. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Key to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`FlattenedVerifyResult`](../interfaces/types.FlattenedVerifyResult.md)\>

▸ **flattenedVerify**(`jws`, `getKey`, `options?`): `Promise`<[`FlattenedVerifyResult`](../interfaces/types.FlattenedVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md) | Flattened JWS. |
| `getKey` | [`FlattenedVerifyGetKey`](../interfaces/jws_flattened_verify.FlattenedVerifyGetKey.md) | Function resolving a key to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`FlattenedVerifyResult`](../interfaces/types.FlattenedVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
