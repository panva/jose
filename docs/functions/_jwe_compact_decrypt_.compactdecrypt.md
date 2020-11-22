# Function: compactDecrypt

▸ **compactDecrypt**(`jwe`: string \| Uint8Array, `key`: [KeyLike](../types/_types_d_.keylike.md) \| [CompactDecryptGetKey](../interfaces/_jwe_compact_decrypt_.compactdecryptgetkey.md), `options?`: [DecryptOptions](../interfaces/_types_d_.decryptoptions.md)): Promise\<[CompactDecryptResult](../interfaces/_types_d_.compactdecryptresult.md)>

*Defined in [src/jwe/compact/decrypt.ts:63](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/decrypt.ts#L63)*

Decrypts a Compact JWE.

**`example`** 
```js
// ESM import
import compactDecrypt from 'jose/jwe/compact/decrypt'
```

**`example`** 
```js
// CJS import
const { default: compactDecrypt } = require('jose/jwe/compact/decrypt')
```

**`example`** 
```js
// usage
import parseJwk from 'jose/jwk/parse'

const decoder = new TextDecoder()
const jwe = 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.nyQ19eq9ogh9wA7fFtnI2oouzy5_8b5DeLkoRMfi2yijgfTs2zEnayCEofz_qhnL-nwszabd9qUeHv0-IwvhhJJS7GUJOU3ikiIe42qcIAFme1A_Fo9CTxw4XTOy-I5qanl8So91u6hwfyN1VxAqVLsSE7_23EC-gfGEg_5znew9PyXXsOIE-K_HH7IQowRrlZ1X_bM_Liu53RzDpLDvRz59mp3S8L56YqpM8FexFGTGpEaoTcEIst375qncYt3-79IVR7gZN1RWsWgjPatfvVbnh74PglQcATSf3UUhaW0OAKn6q7r3PDx6DIKQ35bgHQg5QopuN00eIfLQL2trGw.W3grIVj5HVuAb76X.6PcuDe5D6ttWFYyv0oqqdDXfI2R8wBg1F2Q80UUA_Gv8eEimNWfxIWdLxrjzgQGSvIhxmFKuLM0.a93_Ug3uZHuczj70Zavx8Q'
const privateKey = await parseJwk({
  e: 'AQAB',
  n: 'qpzYkTGRKSUcd12hZaJnYEKVLfdEsqu6HBAxZgRSvzLFj_zTSAEXjbf3fX47MPEHRw8NDcEXPjVOz84t4FTXYF2w2_LGWfp_myjV8pR6oUUncJjS7DhnUmTG5bpuK2HFXRMRJYz_iNR48xRJPMoY84jrnhdIFx8Tqv6w4ZHVyEvcvloPgwG3UjLidP6jmqbTiJtidVLnpQJRuFNFQJiluQXBZ1nOLC7raQshu7L9y0IatVU7vf0BPnmuSkcNNvmQkSta6ODQBPaL5-o5SW8H37vQjPDkrlJpreViNa3jqP5DB5HYUO-DMh4FegRv9gZWLDEvXpSd9A13YXCa9Q8K_w',
  d: 'YAfYfiEAK8CPvUAeUC6RMUVI4o6DRG4UWydiJqHYUXYqbVlJMwYqU8Jws1oRxwJjrkNyfYNpqcInkh_jApm-gKc7nRGRQ6QTnynlAp1ASPW7tUzPq9YzkdTXfwboa9KkXDcXN6OdUU8GpQuODYFTegBfXqSMFzeOwniI5u5G_m2I6YU1zU4x7dxaKhPSK2mJ1v-tJu88j855DYIY0AiX5uf_oa0CgaqyOOY3LaxGjV0FxrkAzYluHfQef7ux-1ocXD1aUrdj3owk48ZVEb2o-V1bMLtk415ngS-u89bABHuJ50-gIwpO-y7ofe6ik4fAd9NfD8PVKHHsrNYbC5FdAQ',
  p: '4WlvPw4Vf-mHzoqem_2VUf7hMiLEM5sl_th-CZyA0dowhEnNBJPtaqCz2k_6_ECKZ5C-KoT-EmQOBILQFJtR9SOs6fI9yZGL1OpbjGNKpWzym8iQrFcKAhFvQ_hG7Fkwz6_yRV5fKnOWSD78Rk6wuOTaXqwJS7uljvrn7SmRFpE',
  q: 'wcO_PHrkHazbqDgBVvTDaMXJ7W5l0RTxhrOsU6qGCLp367Zc2F9BwPAlMy9KKMhf9RLxgv32lGqWxVh3WQ1GSJqswSIKhfAOzmuTDjlYxqrte_TMcaVDxtRuO8Bxp5A8Y7i3VxQ_Rjfa04QLxJfiRdap4UamYWco25WKH4rkcI8',
  dp: 'rWynEIZPeEg-GmSAP1fMqHdG34HsHiBCDV6XKeHlIo-SQFVfjSQax6y4c0CRw74MPj4YcTI9H_0m48WZPiF53vcBtESR0SFPyhI9OTezWK8HwV-AH3gf1ROA3XSJbJH6ge_GoCRJZ6nid9ct1RH52WcJs0j9Je1LJURZaBhQ7mE',
  dq: 'tYrMc0ME1dTuHQcUIj_Dkje2gLGtzZ6cyMMw01byq9zhnMRI6yUcu0OE5xcImXtbhIfSJhQCYn4XcyD2-UWZs07QS0e0qlcH2Fkr9-i9B66AQWJT5qqb_P9tpKgjFIbsPdaEWJ8MxaJxcTnHuNNBWoPMuNfz7VC1FD9goTsF23s',
  qi: 'qAZmEWhWcDgW_pQZA5e7r185-sOnNPAW53y16QKh5wNThGjpUl7OvePZWY59ekd6PYwvkloNIRki6mLskP9NZ73CsAdZknSAPaAmBuNGYDabtObcigQDPFQ5DeqyAdRUrim66eN7whE5mf_XgOwVAx3-9PtfHvvmTTNezHfoZdo',
  kty: 'RSA'
}, 'RSA-OAEP-256')

const { plaintext, protectedHeader } = await compactDecrypt(jwe, privateKey)

console.log(protectedHeader)
console.log(decoder.decode(plaintext))
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`jwe` | string \| Uint8Array | Compact JWE. |
`key` | [KeyLike](../types/_types_d_.keylike.md) \| [CompactDecryptGetKey](../interfaces/_jwe_compact_decrypt_.compactdecryptgetkey.md) | Private Key or Secret, or a function resolving one, to decrypt the JWE with. |
`options?` | [DecryptOptions](../interfaces/_types_d_.decryptoptions.md) | JWE Decryption options.  |

**Returns:** Promise\<[CompactDecryptResult](../interfaces/_types_d_.compactdecryptresult.md)>
