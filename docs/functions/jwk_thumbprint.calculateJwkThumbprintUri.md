# Function: calculateJwkThumbprintUri

[💗 Help the project](https://github.com/sponsors/panva)

▸ **calculateJwkThumbprintUri**(`jwk`, `digestAlgorithm?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>

Calculates a JSON Web Key (JWK) Thumbprint URI

**`example`** Usage

```js
const thumbprintUri = await jose.calculateJwkThumbprintUri({
  kty: 'EC',
  crv: 'P-256',
  x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
  y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
})

console.log(thumbprint)
// 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:w9eYdC6_s_tLQ8lH6PUpc0mddazaqtPgeC2IgWDiqY8'
```

**`see`** [RFC9278](https://www.rfc-editor.org/rfc/rfc9278)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwk` | [`JWK`](../interfaces/types.JWK.md) | JSON Web Key. |
| `digestAlgorithm?` | ``"sha256"`` \| ``"sha384"`` \| ``"sha512"`` | Digest Algorithm to use for calculating the thumbprint. Default is "sha256". |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>
