# Function: compactDecrypt

▸ **compactDecrypt**(`jwe`, `key`, `options?`): `Promise`<[`CompactDecryptResult`](../interfaces/types.CompactDecryptResult.md)\>

Decrypts a Compact JWE.

**`example`** Usage
```js
const decoder = new TextDecoder()
const jwe = 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.nyQ19eq9ogh9wA7fFtnI2oouzy5_8b5DeLkoRMfi2yijgfTs2zEnayCEofz_qhnL-nwszabd9qUeHv0-IwvhhJJS7GUJOU3ikiIe42qcIAFme1A_Fo9CTxw4XTOy-I5qanl8So91u6hwfyN1VxAqVLsSE7_23EC-gfGEg_5znew9PyXXsOIE-K_HH7IQowRrlZ1X_bM_Liu53RzDpLDvRz59mp3S8L56YqpM8FexFGTGpEaoTcEIst375qncYt3-79IVR7gZN1RWsWgjPatfvVbnh74PglQcATSf3UUhaW0OAKn6q7r3PDx6DIKQ35bgHQg5QopuN00eIfLQL2trGw.W3grIVj5HVuAb76X.6PcuDe5D6ttWFYyv0oqqdDXfI2R8wBg1F2Q80UUA_Gv8eEimNWfxIWdLxrjzgQGSvIhxmFKuLM0.a93_Ug3uZHuczj70Zavx8Q'

const { plaintext, protectedHeader } = await compactDecrypt(jwe, privateKey)

console.log(protectedHeader)
console.log(decoder.decode(plaintext))
```

**`example`** ESM import
```js
import { compactDecrypt } from 'jose'
```

**`example`** CJS import
```js
const { compactDecrypt } = require('jose')
```

**`example`** Deno import
```js
import { compactDecrypt } from 'https://deno.land/x/jose@v4.0.4/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | `string` \| `Uint8Array` | Compact JWE. |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`CompactDecryptResult`](../interfaces/types.CompactDecryptResult.md)\>

▸ **compactDecrypt**(`jwe`, `getKey`, `options?`): `Promise`<[`CompactDecryptResult`](../interfaces/types.CompactDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | `string` \| `Uint8Array` | Compact JWE. |
| `getKey` | [`CompactDecryptGetKey`](../interfaces/jwe_compact_decrypt.CompactDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt the JWE with. |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

`Promise`<[`CompactDecryptResult`](../interfaces/types.CompactDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
