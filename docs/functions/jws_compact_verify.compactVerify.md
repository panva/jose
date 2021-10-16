# Function: compactVerify

▸ **compactVerify**(`jws`, `key`, `options?`): `Promise`<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md)\>

Verifies the signature and format of and afterwards decodes the Compact JWS.

**`example`** Usage
```js
const decoder = new TextDecoder()
const jws = 'eyJhbGciOiJFUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.kkAs_gPPxWMI3rHuVlxHaTPfDWDoqdI8jSvuSmqV-8IHIWXg9mcAeC9ggV-45ZHRbiRJ3obUIFo1rHphPA5URg'

const { payload, protectedHeader } = await compactVerify(jws, publicKey)

console.log(protectedHeader)
console.log(decoder.decode(payload))
```

**`example`** ESM import
```js
import { compactVerify } from 'jose'
```

**`example`** CJS import
```js
const { compactVerify } = require('jose')
```

**`example`** Deno import
```js
import { compactVerify } from 'https://deno.land/x/jose@v4.0.3/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | `string` \| `Uint8Array` | Compact JWS. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Key to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md)\>

▸ **compactVerify**(`jws`, `getKey`, `options?`): `Promise`<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | `string` \| `Uint8Array` | Compact JWS. |
| `getKey` | [`CompactVerifyGetKey`](../interfaces/jws_compact_verify.CompactVerifyGetKey.md) | Function resolving a key to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`CompactVerifyResult`](../interfaces/types.CompactVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
