# Function: generalDecrypt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **generalDecrypt**(`jwe`, `key`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md)\>

Decrypts a General JWE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [`GeneralJWE`](../interfaces/types.GeneralJWE.md) | General JWE. |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to decrypt the JWE with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md)\>

**`Example`**

```js
const jwe = {
  ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
  iv: '8Fy7A_IuoX5VXG9s',
  tag: 'W76IYV6arGRuDSaSyWrQNg',
  aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
  protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
  recipients: [
    {
      encrypted_key:
        'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
    },
  ],
}

const { plaintext, protectedHeader, additionalAuthenticatedData } =
  await jose.generalDecrypt(jwe, privateKey)

console.log(protectedHeader)
const decoder = new TextDecoder()
console.log(decoder.decode(plaintext))
console.log(decoder.decode(additionalAuthenticatedData))
```

▸ **generalDecrypt**<`KeyLikeType`\>(`jwe`, `getKey`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`KeyLikeType`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `KeyLikeType` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | [`GeneralJWE`](../interfaces/types.GeneralJWE.md) | General JWE. |
| `getKey` | [`GeneralDecryptGetKey`](../interfaces/jwe_general_decrypt.GeneralDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt the JWE with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`DecryptOptions`](../interfaces/types.DecryptOptions.md) | JWE Decryption options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`GeneralDecryptResult`](../interfaces/types.GeneralDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`KeyLikeType`\>\>
