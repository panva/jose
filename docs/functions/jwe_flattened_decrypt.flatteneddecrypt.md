# Function: flattenedDecrypt

[jwe/flattened/decrypt](../modules/jwe_flattened_decrypt.md).flattenedDecrypt

▸ **flattenedDecrypt**(`jwe`: [*FlattenedJWE*](../interfaces/types.flattenedjwe.md), `key`: [*KeyLike*](../types/types.keylike.md) \| [*FlattenedDecryptGetKey*](../interfaces/jwe_flattened_decrypt.flatteneddecryptgetkey.md), `options?`: [*DecryptOptions*](../interfaces/types.decryptoptions.md)): *Promise*<[*FlattenedDecryptResult*](../interfaces/types.flatteneddecryptresult.md)\>

Decrypts a Flattened JWE.

**`example`** ESM import
```js
import { flattenedDecrypt } from 'jose/jwe/flattened/decrypt'
```

**`example`** CJS import
```js
const { flattenedDecrypt } = require('jose/jwe/flattened/decrypt')
```

**`example`** Usage
```js
const decoder = new TextDecoder()
const jwe = {
  ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
  iv: '8Fy7A_IuoX5VXG9s',
  tag: 'W76IYV6arGRuDSaSyWrQNg',
  encrypted_key: 'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
  aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
  protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0'
}

const {
  plaintext,
  protectedHeader,
  additionalAuthenticatedData
} = await flattenedDecrypt(jwe, privateKey)

console.log(protectedHeader)
console.log(decoder.decode(plaintext))
console.log(decoder.decode(additionalAuthenticatedData))
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [*FlattenedJWE*](../interfaces/types.flattenedjwe.md) | Flattened JWE. |
| `key` | [*KeyLike*](../types/types.keylike.md) \| [*FlattenedDecryptGetKey*](../interfaces/jwe_flattened_decrypt.flatteneddecryptgetkey.md) | Public Key or Secret, or a function resolving one, to decrypt the JWE with. |
| `options?` | [*DecryptOptions*](../interfaces/types.decryptoptions.md) | JWE Decryption options. |

**Returns:** *Promise*<[*FlattenedDecryptResult*](../interfaces/types.flatteneddecryptresult.md)\>

Defined in: [jwe/flattened/decrypt.ts:76](https://github.com/panva/jose/blob/v3.12.0/src/jwe/flattened/decrypt.ts#L76)
