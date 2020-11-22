# Function: createRemoteJWKSet

▸ **createRemoteJWKSet**(`url`: URL, `options?`: [RemoteJWKSetOptions](../interfaces/_jwks_remote_.remotejwksetoptions.md)): [GetKeyFunction](../interfaces/_types_d_.getkeyfunction.md)\<[JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md), [FlattenedJWSInput](../interfaces/_types_d_.flattenedjwsinput.md)>

*Defined in [src/jwks/remote.ts:245](https://github.com/panva/jose/blob/v3.1.0/src/jwks/remote.ts#L245)*

Returns a function that resolves to a key object downloaded from a
remote endpoint returning a JSON Web Key Set, that is, for example,
an OAuth 2.0 or OIDC jwks_uri. Only a single public key must match
the selection process.

**`example`** 
```js
// ESM import
import createRemoteJWKSet from 'jose/jwks/remote'
```

**`example`** 
```js
// CJS import
const { default: createRemoteJWKSet } = require('jose/jwks/remote')
```

**`example`** 
```js
// usage
import jwtVerify from 'jose/jwt/verify'

const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const { payload, protectedHeader } = await jwtVerify(jwt, JWKS, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})
console.log(protectedHeader)
console.log(payload)
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`url` | URL | URL to fetch the JSON Web Key Set from. |
`options?` | [RemoteJWKSetOptions](../interfaces/_jwks_remote_.remotejwksetoptions.md) | Options for the remote JSON Web Key Set.  |

**Returns:** [GetKeyFunction](../interfaces/_types_d_.getkeyfunction.md)\<[JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md), [FlattenedJWSInput](../interfaces/_types_d_.flattenedjwsinput.md)>
