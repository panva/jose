# Function: generalVerify

▸ **generalVerify**(`jws`: [GeneralJWSInput](../interfaces/_types_d_.generaljwsinput.md), `key`: [KeyLike](../types/_types_d_.keylike.md) \| [GeneralVerifyGetKey](../interfaces/_jws_general_verify_.generalverifygetkey.md), `options?`: [VerifyOptions](../interfaces/_types_d_.verifyoptions.md)): Promise<[GeneralVerifyResult](../interfaces/_types_d_.generalverifyresult.md)\>

*Defined in [src/jws/general/verify.ts:69](https://github.com/panva/jose/blob/v3.6.1/src/jws/general/verify.ts#L69)*

Verifies the signature and format of and afterwards decodes the General JWS.

**`example`** 
```js
// ESM import
import generalVerify from 'jose/jws/general/verify'
```

**`example`** 
```js
// CJS import
const { default: generalVerify } = require('jose/jws/general/verify')
```

**`example`** 
```js
// usage
import parseJwk from 'jose/jwk/parse'

const decoder = new TextDecoder()
const jws = {
  payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
  signatures: [
    {
      signature: 'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
      protected: 'eyJhbGciOiJFUzI1NiJ9'
    }
  ]
}
const publicKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})

const { payload, protectedHeader } = await generalVerify(jws, publicKey)

console.log(protectedHeader)
console.log(decoder.decode(payload))
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`jws` | [GeneralJWSInput](../interfaces/_types_d_.generaljwsinput.md) | General JWS. |
`key` | [KeyLike](../types/_types_d_.keylike.md) \| [GeneralVerifyGetKey](../interfaces/_jws_general_verify_.generalverifygetkey.md) | Key, or a function resolving a key, to verify the JWS with. |
`options?` | [VerifyOptions](../interfaces/_types_d_.verifyoptions.md) | JWS Verify options.  |

**Returns:** Promise<[GeneralVerifyResult](../interfaces/_types_d_.generalverifyresult.md)\>
