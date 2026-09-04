# Function: createRemoteJWKSet()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **createRemoteJWKSet**(`url`, `options?`): [`RemoteJWKSet`](../interfaces/RemoteJWKSet.md)

Creates a resolver for a JSON Web Key Set available at an HTTP(S) URL.

The JSON Web Key Set is fetched when no key matches, but only as frequently as the
`cooldownDuration` option allows. Selection uses the header's "alg" (Algorithm) and "kid" (Key
ID), and respects the JWK's "use" (Public Key Use) and "key_ops" (Key Operations). Exactly one
key must match.

Only a single public key must match the selection process. As shown in the example below when
multiple keys get matched it is possible to opt-in to iterate over the matched keys and attempt
verification in an iterative manner.

> [!NOTE]\
> The function's purpose is to resolve public keys used for verifying signatures and will not work
> for public encryption keys.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jwks/remote'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | [`URL`](https://developer.mozilla.org/docs/Web/API/URL) | URL to fetch the JSON Web Key Set from. |
| `options?` | [`RemoteJWKSetOptions`](../interfaces/RemoteJWKSetOptions.md) | Options for the remote JSON Web Key Set. |

## Returns

[`RemoteJWKSet`](../interfaces/RemoteJWKSet.md)

## Examples

```js
const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})
console.log(protectedHeader)
console.log(payload)
```

Opting-in to multiple JWKS matches using `createRemoteJWKSet`

```js
const options = {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
}
const { payload, protectedHeader } = await jose
  .jwtVerify(jwt, JWKS, options)
  .catch(async (error) => {
    if (error instanceof jose.errors.JWKSMultipleMatchingKeys) {
      for await (const publicKey of error) {
        try {
          return await jose.jwtVerify(jwt, publicKey, options)
        } catch (innerError) {
          if (innerError instanceof jose.errors.JWSSignatureVerificationFailed) {
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
