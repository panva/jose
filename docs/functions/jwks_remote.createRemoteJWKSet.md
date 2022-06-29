# Function: createRemoteJWKSet

[💗 Help the project](https://github.com/sponsors/panva)

▸ **createRemoteJWKSet**(`url`, `options?`): [`GetKeyFunction`](../interfaces/types.GetKeyFunction.md)<[`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md), [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md)\>

Returns a function that resolves to a key object downloaded from a remote endpoint returning a
JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC jwks_uri. Only a single public key
must match the selection process. The JSON Web Key Set is fetched when no key matches the
selection process but only as frequently as the `cooldownDuration` option allows, to prevent abuse.

**`example`** Usage

```js
const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})
console.log(protectedHeader)
console.log(payload)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `URL` | URL to fetch the JSON Web Key Set from. |
| `options?` | [`RemoteJWKSetOptions`](../interfaces/jwks_remote.RemoteJWKSetOptions.md) | Options for the remote JSON Web Key Set. |

#### Returns

[`GetKeyFunction`](../interfaces/types.GetKeyFunction.md)<[`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md), [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md)\>
