# Function: compactDecrypt

[jwe/compact/decrypt](../modules/jwe_compact_decrypt.md).compactDecrypt

▸ **compactDecrypt**(`jwe`, `key`, `options?`): `Promise`<[`CompactDecryptResult`](../interfaces/types.CompactDecryptResult.md)\>

Decrypts a Compact JWE.

**`example`** ESM import
```js
import { compactDecrypt } from 'jose/jwe/compact/decrypt'
```

**`example`** CJS import
```js
const { compactDecrypt } = require('jose/jwe/compact/decrypt')
```

**`example`** Usage
```js
const decoder = new TextDecoder()
const jwe = 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.nyQ19eq9ogh9wA7fFtnI2oouzy5_8b5DeLkoRMfi2yijgfTs2zEnayCEofz_qhnL-nwszabd9qUeHv0-IwvhhJJS7GUJOU3ikiIe42qcIAFme1A_Fo9CTxw4XTOy-I5qanl8So91u6hwfyN1VxAqVLsSE7_23EC-gfGEg_5znew9PyXXsOIE-K_HH7IQowRrlZ1X_bM_Liu53RzDpLDvRz59mp3S8L56YqpM8FexFGTGpEaoTcEIst375qncYt3-79IVR7gZN1RWsWgjPatfvVbnh74PglQcATSf3UUhaW0OAKn6q7r3PDx6DIKQ35bgHQg5QopuN00eIfLQL2trGw.W3grIVj5HVuAb76X.6PcuDe5D6ttWFYyv0oqqdDXfI2R8wBg1F2Q80UUA_Gv8eEimNWfxIWdLxrjzgQGSvIhxmFKuLM0.a93_Ug3uZHuczj70Zavx8Q'

const { plaintext, protectedHeader } = await compactDecrypt(jwe, privateKey)

console.log(protectedHeader)
console.log(decoder.decode(plaintext))
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | `string` \| `Uint8Array` | Compact JWE. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| [`CompactDecryptGetKey`](../interfaces/jwe_compact_decrypt.CompactDecryptGetKey.md) | Private Key or Secret, or a function resolving one, to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`CompactDecryptResult`](../interfaces/types.CompactDecryptResult.md)\>

#### Defined in

[jwe/compact/decrypt.ts:47](https://github.com/panva/jose/blob/v3.14.4/src/jwe/compact/decrypt.ts#L47)
