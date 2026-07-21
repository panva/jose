# Class: GeneralSignSDJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Builds and signs General JWS JSON serialized SD-JWTs.

This class is exported from the `'jose/sd-jwt'` subpath.

General verification returns the headers of the first successfully verified signature. The RFC
9901 Disclosure and Key Binding transport parameters are always carried by the first signature's
unprotected header.

## Example

```js
import { GeneralSignSDJWT, generalSdJwtReceive, generalSdJwtVerify } from 'jose/sd-jwt'

const issued = await new GeneralSignSDJWT({ given_name: 'John' })
  .setDisclosurePaths(['/given_name'])
  .addSignature(firstIssuerPrivateKey)
  .setProtectedHeader({ alg: 'ES256', kid: 'first' })
  .addSignature(secondIssuerPrivateKey)
  .setProtectedHeader({ alg: 'ES256', kid: 'second' })
  .sign()

const credential = await generalSdJwtReceive(issued, secondIssuerPublicKey)
const presentation = await credential.present(['/given_name'])
const { payload, protectedHeader } = await generalSdJwtVerify(
  presentation,
  secondIssuerPublicKey,
  { keyBinding: false },
)
```

## Constructors

### Constructor

▸ **new GeneralSignSDJWT**(`payload?`): `GeneralSignSDJWT`

GeneralSignSDJWT constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

#### Returns

`GeneralSignSDJWT`

## Methods

### addDecoys()

▸ **addDecoys**(`container`, `count`): `this`

Adds Decoy Digests to the object or array identified by an RFC 6901 JSON Pointer. Decoys can
obscure the number of claims or array elements but increase presentation size; their usefulness
depends on a consistent application strategy.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `container` | `string` |
| `count` | [`SDJWTDecoyCount`](../../../types/type-aliases/SDJWTDecoyCount.md) |

#### Returns

`this`

#### Example

**Add a fixed number of Decoy Digests at the root and a random number to an array**

```js
import { SignSDJWT } from 'jose/sd-jwt'

const sdJwt = await new SignSDJWT({
  given_name: 'John',
  nationalities: ['AT', 'NZ'],
})
  .setProtectedHeader({ alg: 'ES256' })
  .setDisclosurePaths(['/given_name', '/nationalities/1'])
  .addDecoys('', 2)
  .addDecoys('/nationalities', { min: 1, max: 3 })
  .sign(issuerPrivateKey)
```

***

### addSignature()

▸ **addSignature**(`key`, `options?`): [`SDJWTSignature`](../interfaces/SDJWTSignature.md)

Adds an additional signature to the General JWS JSON serialized SD-JWT.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | [`SDJWTIssuerSigningKey`](../type-aliases/SDJWTIssuerSigningKey.md) |
| `options?` | [`SignOptions`](../../../types/interfaces/SignOptions.md) |

#### Returns

[`SDJWTSignature`](../interfaces/SDJWTSignature.md)

***

### setAudience()

▸ **setAudience**(`audience`): `this`

Set the "aud" (Audience) Claim.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setDisclosurePaths()

▸ **setDisclosurePaths**(`paths`): `this`

Selects final JWT Claims Set values to make selectively disclosable. Each path is an
[RFC 6901 JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901) evaluated against the
Claims Set when it is signed. This method can only be called once.

The root pointer (`''`) is not a valid Disclosure path (`'/'` addresses an object member whose
name is empty). Use `~0` to escape `~`, `~1` to escape `/`, and canonical zero-based indices
for arrays. Missing and duplicate paths are rejected.

`iss`, `exp`, `nbf`, `cnf` and its descendants, and the complete `aud` claim cannot be made
selectively disclosable. Application profiles must also keep every other claim used to decide
credential validity non-selectively disclosable.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `paths` | readonly `string`[] |

#### Returns

`this`

#### Example

**Nested objects, arrays, and escaped member names**

```js
import { SignSDJWT } from 'jose/sd-jwt'

const sdJwt = await new SignSDJWT({
  address: { street: 'Main Street' },
  nationalities: ['AT', 'NZ'],
  'a/b': { '~verified': true },
})
  .setProtectedHeader({ alg: 'ES256' })
  .setDisclosurePaths(['/address/street', '/nationalities/1', '/a~1b/~0verified'])
  .sign(issuerPrivateKey)
```

***

### setExpirationTime()

▸ **setExpirationTime**(`input`): `this`

Set the "exp" (Expiration Time) Claim.

- If a `number` is passed as an argument it is used as the claim directly.
- If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
  claim.
- If a `string` is passed as an argument it is resolved to a time span, and then added to the
  current unix timestamp and used as the claim.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
"m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
"years", "yr", "yrs", and "y". It is not possible to specify months. 365.25 days is used as an
alias for a year.

If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
subtracted from the current unix timestamp. A "from now" suffix can also be used for
readability when adding to the current unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setHashAlgorithm()

▸ **setHashAlgorithm**(`algorithm`): `this`

Selects the hash algorithm used for Disclosure and Decoy Digests. The default is `sha-256`.
Choose a hash with collision resistance appropriate for the Issuer signature algorithm.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `algorithm` | [`SDJWTHashAlgorithm`](../../../types/type-aliases/SDJWTHashAlgorithm.md) |

#### Returns

`this`

***

### setIssuedAt()

▸ **setIssuedAt**(`input?`): `this`

Set the "iat" (Issued At) Claim.

- If no argument is used the current unix timestamp is used as the claim.
- If a `number` is passed as an argument it is used as the claim directly.
- If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
  claim.
- If a `string` is passed as an argument it is resolved to a time span, and then added to the
  current unix timestamp and used as the claim.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
"m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
"years", "yr", "yrs", and "y". It is not possible to specify months. 365.25 days is used as an
alias for a year.

If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
subtracted from the current unix timestamp. A "from now" suffix can also be used for
readability when adding to the current unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input?` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "iat" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setIssuer()

▸ **setIssuer**(`issuer`): `this`

Set the "iss" (Issuer) Claim.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setJti()

▸ **setJti**(`jwtId`): `this`

Set the "jti" (JWT ID) Claim.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setNotBefore()

▸ **setNotBefore**(`input`): `this`

Set the "nbf" (Not Before) Claim.

- If a `number` is passed as an argument it is used as the claim directly.
- If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
  claim.
- If a `string` is passed as an argument it is resolved to a time span, and then added to the
  current unix timestamp and used as the claim.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
"m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
"years", "yr", "yrs", and "y". It is not possible to specify months. 365.25 days is used as an
alias for a year.

If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
subtracted from the current unix timestamp. A "from now" suffix can also be used for
readability when adding to the current unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "nbf" (Not Before) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setSubject()

▸ **setSubject**(`subject`): `this`

Set the "sub" (Subject) Claim.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\>

Signs and returns an RFC 9901 General JWS JSON serialized SD-JWT.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\>
