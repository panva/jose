# Function: createRemoteJWKSet

▸ **createRemoteJWKSet**(`url`, `options?`): [`GetKeyFunction`](../interfaces/types.GetKeyFunction.md)<[`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md), [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md)\>

Returns a function that resolves to a key object downloaded from a
remote endpoint returning a JSON Web Key Set, that is, for example,
an OAuth 2.0 or OIDC jwks_uri. Only a single public key must match
the selection process.

**`example`** Usage
```js
import { jwtVerify } from 'jose'

const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const { payload, protectedHeader } = await jwtVerify(jwt, JWKS, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})
console.log(protectedHeader)
console.log(payload)
```

**`example`** ESM import
```js
import { createRemoteJWKSet } from 'jose'
```

**`example`** CJS import
```js
const { createRemoteJWKSet } = require('jose')
```

**`example`** Deno import
```js
import { createRemoteJWKSet } from 'https://deno.land/x/jose@v3.20.3/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `URL` | URL to fetch the JSON Web Key Set from. |
| `options?` | [`RemoteJWKSetOptions`](../interfaces/jwks_remote.RemoteJWKSetOptions.md) | Options for the remote JSON Web Key Set. |

#### Returns

[`GetKeyFunction`](../interfaces/types.GetKeyFunction.md)<[`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md), [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md)\>
