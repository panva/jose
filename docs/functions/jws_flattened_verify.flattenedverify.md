# Function: flattenedVerify

[jws/flattened/verify](../modules/jws_flattened_verify.md).flattenedVerify

▸ **flattenedVerify**(`jws`: [*FlattenedJWSInput*](../interfaces/types.flattenedjwsinput.md), `key`: [*KeyLike*](../types/types.keylike.md) \| [*FlattenedVerifyGetKey*](../interfaces/jws_flattened_verify.flattenedverifygetkey.md), `options?`: [*VerifyOptions*](../interfaces/types.verifyoptions.md)): *Promise*<[*FlattenedVerifyResult*](../interfaces/types.flattenedverifyresult.md)\>

Verifies the signature and format of and afterwards decodes the Flattened JWS.

**`example`** 
```js
// ESM import
import { flattenedVerify } from 'jose/jws/flattened/verify'
```

**`example`** 
```js
// CJS import
const { flattenedVerify } = require('jose/jws/flattened/verify')
```

**`example`** 
```js
// usage
import { parseJwk } from 'jose/jwk/parse'

const decoder = new TextDecoder()
const jws = {
  signature: 'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
  payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
  protected: 'eyJhbGciOiJFUzI1NiJ9'
}
const publicKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})

const { payload, protectedHeader } = await flattenedVerify(jws, publicKey)

console.log(protectedHeader)
console.log(decoder.decode(payload))
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`jws` | [*FlattenedJWSInput*](../interfaces/types.flattenedjwsinput.md) | Flattened JWS.   |
`key` | [*KeyLike*](../types/types.keylike.md) \| [*FlattenedVerifyGetKey*](../interfaces/jws_flattened_verify.flattenedverifygetkey.md) | Key, or a function resolving a key, to verify the JWS with.   |
`options?` | [*VerifyOptions*](../interfaces/types.verifyoptions.md) | JWS Verify options.    |

**Returns:** *Promise*<[*FlattenedVerifyResult*](../interfaces/types.flattenedverifyresult.md)\>

Defined in: [jws/flattened/verify.ts:75](https://github.com/panva/jose/blob/v3.10.0/src/jws/flattened/verify.ts#L75)
