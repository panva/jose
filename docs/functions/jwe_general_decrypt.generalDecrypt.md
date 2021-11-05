# Function: generalDecrypt

▸ **generalDecrypt**(`jwe`, `key`, `options?`): `Promise`<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md)\>

Decrypts a General JWE.

**`example`** ESM import
```js
import { generalDecrypt } from 'jose'
```

**`example`** CJS import
```js
const { generalDecrypt } = require('jose')
```

**`example`** Deno import
```js
import { generalDecrypt } from 'https://deno.land/x/jose@v4.1.5/index.ts'
```

**`example`** Usage
```js
const decoder = new TextDecoder()
const jwe = {
  ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
  iv: '8Fy7A_IuoX5VXG9s',
  tag: 'W76IYV6arGRuDSaSyWrQNg',
  aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
  protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
  recipients: [
    {
      encrypted_key: 'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA'
    }
  ]
}

const {
  plaintext,
  protectedHeader,
  additionalAuthenticatedData
} = await generalDecrypt(jwe, privateKey)

console.log(protectedHeader)
console.log(decoder.decode(plaintext))
console.log(decoder.decode(additionalAuthenticatedData))
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [`GeneralJWE`](../interfaces/types.GeneralJWE.md) | General JWE. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md)\>

▸ **generalDecrypt**(`jwe`, `getKey`, `options?`): `Promise`<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [`GeneralJWE`](../interfaces/types.GeneralJWE.md) | General JWE. |
| `getKey` | [`GeneralDecryptGetKey`](../interfaces/jwe_general_decrypt.GeneralDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
