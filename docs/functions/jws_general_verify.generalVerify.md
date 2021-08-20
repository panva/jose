# Function: generalVerify

[jws/general/verify](../modules/jws_general_verify.md).generalVerify

▸ **generalVerify**(`jws`, `key`, `options?`): `Promise`<[`GeneralVerifyResult`](../interfaces/types.GeneralVerifyResult.md)\>

Verifies the signature and format of and afterwards decodes the General JWS.

**`example`** ESM import
```js
import { generalVerify } from 'jose/jws/general/verify'
```

**`example`** CJS import
```js
const { generalVerify } = require('jose/jws/general/verify')
```

**`example`** Deno import
```js
import { generalVerify } from 'https://deno.land/x/jose@v3.15.1/jws/general/verify.ts'
```

**`example`** Usage
```js
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

const { payload, protectedHeader } = await generalVerify(jws, publicKey)

console.log(protectedHeader)
console.log(decoder.decode(payload))
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | [`GeneralJWSInput`](../interfaces/types.GeneralJWSInput.md) | General JWS. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| [`GeneralVerifyGetKey`](../interfaces/jws_general_verify.GeneralVerifyGetKey.md) | Key, or a function resolving a key, to verify the JWS with. |
| `options?` | [`VerifyOptions`](../interfaces/types.VerifyOptions.md) | JWS Verify options. |

#### Returns

`Promise`<[`GeneralVerifyResult`](../interfaces/types.GeneralVerifyResult.md)\>

#### Defined in

[jws/general/verify.ts:65](https://github.com/panva/jose/blob/v3.15.1/src/jws/general/verify.ts#L65)
