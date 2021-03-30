# Function: compactVerify

[jws/compact/verify](../modules/jws_compact_verify.md).compactVerify

▸ **compactVerify**(`jws`: *string* \| Uint8Array, `key`: [*KeyLike*](../types/types.keylike.md) \| [*CompactVerifyGetKey*](../interfaces/jws_compact_verify.compactverifygetkey.md), `options?`: [*VerifyOptions*](../interfaces/types.verifyoptions.md)): *Promise*<[*CompactVerifyResult*](../interfaces/types.compactverifyresult.md)\>

Verifies the signature and format of and afterwards decodes the Compact JWS.

**`example`** 
```js
// ESM import
import { compactVerify } from 'jose/jws/compact/verify'
```

**`example`** 
```js
// CJS import
const { compactVerify } = require('jose/jws/compact/verify')
```

**`example`** 
```js
// usage
import { parseJwk } from 'jose/jwk/parse'

const decoder = new TextDecoder()
const jws = 'eyJhbGciOiJFUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.kkAs_gPPxWMI3rHuVlxHaTPfDWDoqdI8jSvuSmqV-8IHIWXg9mcAeC9ggV-45ZHRbiRJ3obUIFo1rHphPA5URg'
const publicKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})

const { payload, protectedHeader } = await compactVerify(jws, publicKey)

console.log(protectedHeader)
console.log(decoder.decode(payload))
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`jws` | *string* \| Uint8Array | Compact JWS.   |
`key` | [*KeyLike*](../types/types.keylike.md) \| [*CompactVerifyGetKey*](../interfaces/jws_compact_verify.compactverifygetkey.md) | Key, or a function resolving a key, to verify the JWS with.   |
`options?` | [*VerifyOptions*](../interfaces/types.verifyoptions.md) | JWS Verify options.    |

**Returns:** *Promise*<[*CompactVerifyResult*](../interfaces/types.compactverifyresult.md)\>

Defined in: [jws/compact/verify.ts:60](https://github.com/panva/jose/blob/v3.11.2/src/jws/compact/verify.ts#L60)
