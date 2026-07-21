# sd-jwt

Selective Disclosure for JSON Web Tokens (SD-JWT)

Supports issuing, presenting, and verifying SD-JWTs and SD-JWTs with Key Binding in Compact,
Flattened JSON, and General JSON serialization syntaxes.

This functionality is exported exclusively from the `'jose/sd-jwt'` subpath.

This module implements the SD-JWT format and processing rules in [RFC
9901](https://www.rfc-editor.org/rfc/rfc9901.html). Application profiles remain responsible for
defining and enforcing their credential schema, required claims, Issuer trust, accepted
algorithms and types, status and revocation checks, and Key Binding policy.

Disclosure paths are RFC 6901 JSON Pointers evaluated against the final JWT Claims Set. The
producer prevents selective disclosure of `iss`, `exp`, `nbf`, `cnf`, and the complete `aud`
claim. Application profiles must likewise avoid selecting any other claim they rely on to
determine a credential's validity, as described in [RFC 9901 Section
9.7](https://www.rfc-editor.org/rfc/rfc9901.html#section-9.7).

Paths are evaluated against the final Claims Set. For example, `/address/street` selects a nested
object member, `/nationalities/1` selects the second array element, and `/a~1b/~0verified`
selects `payload['a/b']['~verified']`. Selecting a nested Disclosure for a presentation
automatically includes any recursively disclosed parent needed to reach it.

Verifiers must always choose an explicit Key Binding policy. `keyBinding: false` rejects a
supplied KB-JWT, while a policy object requires and validates one, preventing downgrade by
removal.

SD-JWT provides selective disclosure, not encryption or anonymity. Use confidential transport and
do not assume presentations are unlinkable.

## Example

**Issue, present, and verify an SD-JWT with mandatory Key Binding**

```js
import { exportJWK, generateKeyPair } from 'jose'
import * as sdJwt from 'jose/sd-jwt'

const issuer = 'https://issuer.example'
const verifier = 'https://verifier.example'
const nonce = crypto.randomUUID() // Issue a fresh nonce for this transaction.

const issuerKeys = await generateKeyPair('ES256')
const holderKeys = await generateKeyPair('ES256')
const holderPublicJwk = await exportJWK(holderKeys.publicKey)

// Issuer
const issued = await new sdJwt.SignSDJWT({
  given_name: 'John',
  family_name: 'Doe',
  address: {
    street_address: '123 Main St',
    locality: 'Anytown',
  },
  cnf: { jwk: holderPublicJwk },
})
  .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
  .setIssuer(issuer)
  .setIssuedAt()
  .setExpirationTime('2 hours')
  .setDisclosurePaths(['/given_name', '/family_name', '/address', '/address/locality'])
  .sign(issuerKeys.privateKey)

// Holder
const credential = await sdJwt.sdJwtReceive(issued, issuerKeys.publicKey, {
  algorithms: ['ES256'],
  issuer,
  typ: 'example+sd-jwt',
  requiredClaims: ['exp'],
})

const presentation = await credential
  .addKeyBinding(holderKeys.privateKey)
  .setProtectedHeader({ alg: 'ES256' })
  .setAudience(verifier)
  .setNonce(nonce)
  .setIssuedAt()
  // Selecting this recursive child automatically includes its /address parent.
  .present(['/given_name', '/address/locality'])

// Verifier
const { payload } = await sdJwt.sdJwtVerify(presentation, issuerKeys.publicKey, {
  algorithms: ['ES256'],
  issuer,
  typ: 'example+sd-jwt',
  requiredClaims: ['exp'],
  keyBinding: {
    audience: verifier,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
// Atomically mark nonce as consumed in the application's replay store.
```

See [FlattenedSignSDJWT](issuer/classes/FlattenedSignSDJWT.md) and [GeneralSignSDJWT](issuer/classes/GeneralSignSDJWT.md) for complete JSON serialization
examples using [flattenedSdJwtReceive](holder/functions/flattenedSdJwtReceive.md), [generalSdJwtReceive](holder/functions/generalSdJwtReceive.md),
[flattenedSdJwtVerify](verifier/functions/flattenedSdJwtVerify.md), and [generalSdJwtVerify](verifier/functions/generalSdJwtVerify.md).

## References

### FlattenedSDJWT

Re-exports [FlattenedSDJWT](../types/interfaces/FlattenedSDJWT.md)

***

### flattenedSdJwtReceive

Re-exports [flattenedSdJwtReceive](holder/functions/flattenedSdJwtReceive.md)

***

### flattenedSdJwtVerify

Re-exports [flattenedSdJwtVerify](verifier/functions/flattenedSdJwtVerify.md)

***

### FlattenedSDJWTVerifyResult

Re-exports [FlattenedSDJWTVerifyResult](verifier/interfaces/FlattenedSDJWTVerifyResult.md)

***

### FlattenedSignSDJWT

Re-exports [FlattenedSignSDJWT](issuer/classes/FlattenedSignSDJWT.md)

***

### GeneralSDJWT

Re-exports [GeneralSDJWT](../types/interfaces/GeneralSDJWT.md)

***

### generalSdJwtReceive

Re-exports [generalSdJwtReceive](holder/functions/generalSdJwtReceive.md)

***

### GeneralSDJWTSignature

Re-exports [GeneralSDJWTSignature](../types/type-aliases/GeneralSDJWTSignature.md)

***

### generalSdJwtVerify

Re-exports [generalSdJwtVerify](verifier/functions/generalSdJwtVerify.md)

***

### GeneralSDJWTVerifyResult

Re-exports [GeneralSDJWTVerifyResult](verifier/interfaces/GeneralSDJWTVerifyResult.md)

***

### GeneralSignSDJWT

Re-exports [GeneralSignSDJWT](issuer/classes/GeneralSignSDJWT.md)

***

### ProduceSDJWT

Re-exports [ProduceSDJWT](../types/interfaces/ProduceSDJWT.md)

***

### SDJWT

Re-exports [SDJWT](../types/type-aliases/SDJWT.md)

***

### SDJWTCredential

Re-exports [SDJWTCredential](holder/interfaces/SDJWTCredential.md)

***

### SDJWTDecoyCount

Re-exports [SDJWTDecoyCount](../types/type-aliases/SDJWTDecoyCount.md)

***

### SDJWTDisclosure

Re-exports [SDJWTDisclosure](holder/interfaces/SDJWTDisclosure.md)

***

### SDJWTHashAlgorithm

Re-exports [SDJWTHashAlgorithm](../types/type-aliases/SDJWTHashAlgorithm.md)

***

### SDJWTHolderKeyResolver

Re-exports [SDJWTHolderKeyResolver](verifier/interfaces/SDJWTHolderKeyResolver.md)

***

### SDJWTHolderSigningKey

Re-exports [SDJWTHolderSigningKey](holder/type-aliases/SDJWTHolderSigningKey.md)

***

### SDJWTHolderVerificationKey

Re-exports [SDJWTHolderVerificationKey](verifier/type-aliases/SDJWTHolderVerificationKey.md)

***

### SDJWTIssuerGetKey

Re-exports [SDJWTIssuerGetKey](../types/interfaces/SDJWTIssuerGetKey.md)

***

### SDJWTIssuerKey

Re-exports [SDJWTIssuerKey](../types/type-aliases/SDJWTIssuerKey.md)

***

### SDJWTIssuerSigningKey

Re-exports [SDJWTIssuerSigningKey](issuer/type-aliases/SDJWTIssuerSigningKey.md)

***

### SDJWTKeyBinding

Re-exports [SDJWTKeyBinding](holder/interfaces/SDJWTKeyBinding.md)

***

### SDJWTKeyBindingPayload

Re-exports [SDJWTKeyBindingPayload](verifier/interfaces/SDJWTKeyBindingPayload.md)

***

### SDJWTKeyBindingVerificationOptions

Re-exports [SDJWTKeyBindingVerificationOptions](verifier/interfaces/SDJWTKeyBindingVerificationOptions.md)

***

### SDJWTKeyBindingVerifyResult

Re-exports [SDJWTKeyBindingVerifyResult](verifier/interfaces/SDJWTKeyBindingVerifyResult.md)

***

### sdJwtReceive

Re-exports [sdJwtReceive](holder/functions/sdJwtReceive.md)

***

### SDJWTReceiveOptions

Re-exports [SDJWTReceiveOptions](holder/interfaces/SDJWTReceiveOptions.md)

***

### SDJWTSignature

Re-exports [SDJWTSignature](issuer/interfaces/SDJWTSignature.md)

***

### SDJWTUnprotectedHeaderParameters

Re-exports [SDJWTUnprotectedHeaderParameters](../types/interfaces/SDJWTUnprotectedHeaderParameters.md)

***

### sdJwtVerify

Re-exports [sdJwtVerify](verifier/functions/sdJwtVerify.md)

***

### SDJWTVerifyOptions

Re-exports [SDJWTVerifyOptions](verifier/interfaces/SDJWTVerifyOptions.md)

***

### SDJWTVerifyResult

Re-exports [SDJWTVerifyResult](verifier/interfaces/SDJWTVerifyResult.md)

***

### SignSDJWT

Re-exports [SignSDJWT](issuer/classes/SignSDJWT.md)
