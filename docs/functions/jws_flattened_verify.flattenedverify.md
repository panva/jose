# Function: flattenedVerify

[jws/flattened/verify](../modules/jws_flattened_verify.md).flattenedVerify

▸ **flattenedVerify**(`jws`, `key`, `options?`): `Promise`<[FlattenedVerifyResult](../interfaces/types.flattenedverifyresult.md)\>

Verifies the signature and format of and afterwards decodes the Flattened JWS.

**`example`** ESM import
```js
import { flattenedVerify } from 'jose/jws/flattened/verify'
```

**`example`** CJS import
```js
const { flattenedVerify } = require('jose/jws/flattened/verify')
```

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | [FlattenedJWSInput](../interfaces/types.flattenedjwsinput.md) | Flattened JWS. |
| `key` | [KeyLike](../types/types.keylike.md) \| [FlattenedVerifyGetKey](../interfaces/jws_flattened_verify.flattenedverifygetkey.md) | Key, or a function resolving a key, to verify the JWS with. |
| `options?` | [VerifyOptions](../interfaces/types.verifyoptions.md) | JWS Verify options. |

#### Returns

`Promise`<[FlattenedVerifyResult](../interfaces/types.flattenedverifyresult.md)\>

#### Defined in

[jws/flattened/verify.ts:66](https://github.com/panva/jose/blob/v3.13.0/src/jws/flattened/verify.ts#L66)
