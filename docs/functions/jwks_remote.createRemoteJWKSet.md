# Function: createRemoteJWKSet

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **createRemoteJWKSet**\<`KeyLikeType`\>(`url`, `options?`): (`protectedHeader?`: [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md), `token?`: [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md)) => [`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType`\>

Returns a function that resolves a JWS JOSE Header to a public key object downloaded from a
remote endpoint returning a JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC
jwks_uri. The JSON Web Key Set is fetched when no key matches the selection process but only as
frequently as the `cooldownDuration` option allows to prevent abuse.

It uses the "alg" (JWS Algorithm) Header Parameter to determine the right JWK "kty" (Key Type),
then proceeds to match the JWK "kid" (Key ID) with one found in the JWS Header Parameters (if
there is one) while also respecting the JWK "use" (Public Key Use) and JWK "key_ops" (Key
Operations) Parameters (if they are present on the JWK).

Only a single public key must match the selection process. As shown in the example below when
multiple keys get matched it is possible to opt-in to iterate over the matched keys and attempt
verification in an iterative manner.

Note: The function's purpose is to resolve public keys used for verifying signatures and will not
work for public encryption keys.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `KeyLikeType` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | [`URL`]( https://developer.mozilla.org/docs/Web/API/URL ) | URL to fetch the JSON Web Key Set from. |
| `options?` | [`RemoteJWKSetOptions`](../interfaces/jwks_remote.RemoteJWKSetOptions.md) | Options for the remote JSON Web Key Set. |

#### Returns

`fn`

▸ (`protectedHeader?`, `token?`): [`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader?` | [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md) |
| `token?` | [`FlattenedJWSInput`](../interfaces/types.FlattenedJWSInput.md) |

##### Returns

[`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType`\>

**`Example`**

```js
const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})
console.log(protectedHeader)
console.log(payload)
```

**`Example`**

Opting-in to multiple JWKS matches using `createRemoteJWKSet`

```js
const options = {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
}
const { payload, protectedHeader } = await jose
  .jwtVerify(jwt, JWKS, options)
  .catch(async (error) => {
    if (error?.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
      for await (const publicKey of error) {
        try {
          return await jose.jwtVerify(jwt, publicKey, options)
        } catch (innerError) {
          if (innerError?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
            continue
          }
          throw innerError
        }
      }
      throw new jose.errors.JWSSignatureVerificationFailed()
    }

    throw error
  })
console.log(protectedHeader)
console.log(payload)
```
