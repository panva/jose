# Function: EmbeddedJWK

▸ **EmbeddedJWK**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

EmbeddedJWK is an implementation of a GetKeyFunction intended to be used with the
JWS/JWT verify operations whenever you need to opt-in to verify signatures with
a public key embedded in the token's "jwk" (JSON Web Key) Header Parameter.
It is recommended to combine this with the verify algorithms option to whitelist
JWS algorithms to accept.

**`example`** Usage
```js
import { jwtVerify } from 'jose'

const jwt = 'eyJqd2siOnsiY3J2IjoiUC0yNTYiLCJ4IjoiVU05ZzVuS25aWFlvdldBbE03NmNMejl2VG96UmpfX0NIVV9kT2wtZ09vRSIsInkiOiJkczhhZVF3MWwyY0RDQTdiQ2tPTnZ3REtwWEFidFhqdnFDbGVZSDhXc19VIiwia3R5IjoiRUMifSwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsImlhdCI6MTYwNDU4MDc5NH0.60boak3_dErnW47ZPty1C0nrjeVq86EN_eK0GOq6K8w2OA0thKoBxFK4j-NuU9yZ_A9UKGxPT_G87DladBaV9g'

const { payload, protectedHeader } = await jwtVerify(jwt, EmbeddedJWK, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(protectedHeader)
console.log(payload)
```

**`example`** ESM import
```js
import { EmbeddedJWK } from 'jose'
```

**`example`** CJS import
```js
const { EmbeddedJWK } = require('jose')
```

**`example`** Deno import
```js
import { EmbeddedJWK } from 'https://deno.land/x/jose@v4.0.1/index.ts'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md) |
| `token` | [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>
