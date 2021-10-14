# Function: flattenedDecrypt

▸ **flattenedDecrypt**(`jwe`, `key`, `options?`): `Promise`<[`FlattenedDecryptResult`](../interfaces/types.FlattenedDecryptResult.md)\>

Decrypts a Flattened JWE.

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

**`example`** ESM import
```js
import { flattenedDecrypt } from 'jose'
```

**`example`** CJS import
```js
const { flattenedDecrypt } = require('jose')
```

**`example`** Deno import
```js
import { flattenedDecrypt } from 'https://deno.land/x/jose@v4.0.0/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [`FlattenedJWE`](../interfaces/types.FlattenedJWE.md) | Flattened JWE. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`FlattenedDecryptResult`](../interfaces/types.FlattenedDecryptResult.md)\>

▸ **flattenedDecrypt**(`jwe`, `getKey`, `options?`): `Promise`<[`FlattenedDecryptResult`](../interfaces/types.FlattenedDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [`FlattenedJWE`](../interfaces/types.FlattenedJWE.md) | Flattened JWE. |
| `getKey` | [`FlattenedDecryptGetKey`](../interfaces/jwe_flattened_decrypt.FlattenedDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`FlattenedDecryptResult`](../interfaces/types.FlattenedDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
