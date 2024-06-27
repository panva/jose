# Class: UnsecuredJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.

**`Example`**

Encoding

```js
const unsecuredJwt = new jose.UnsecuredJWT({ 'urn:example:claim': true })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode()

console.log(unsecuredJwt)
```

**`Example`**

Decoding

```js
const payload = jose.UnsecuredJWT.decode(unsecuredJwt, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(payload)
```

## Table of contents

### Constructors

- [constructor](jwt_unsecured.UnsecuredJWT.md#constructor)

### Methods

- [decode](jwt_unsecured.UnsecuredJWT.md#decode)
- [encode](jwt_unsecured.UnsecuredJWT.md#encode)
- [setAudience](jwt_unsecured.UnsecuredJWT.md#setaudience)
- [setExpirationTime](jwt_unsecured.UnsecuredJWT.md#setexpirationtime)
- [setIssuedAt](jwt_unsecured.UnsecuredJWT.md#setissuedat)
- [setIssuer](jwt_unsecured.UnsecuredJWT.md#setissuer)
- [setJti](jwt_unsecured.UnsecuredJWT.md#setjti)
- [setNotBefore](jwt_unsecured.UnsecuredJWT.md#setnotbefore)
- [setSubject](jwt_unsecured.UnsecuredJWT.md#setsubject)

## Constructors

### constructor

• **new UnsecuredJWT**(`payload?`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

## Methods

### decode

▸ `Static` **decode**\<`PayloadType`\>(`jwt`, `options?`): [`UnsecuredResult`](../interfaces/jwt_unsecured.UnsecuredResult.md)\<`PayloadType`\>

Decodes an unsecured JWT.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | [`JWTPayload`](../interfaces/types.JWTPayload.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` | Unsecured JWT to decode the payload of. |
| `options?` | [`JWTClaimVerificationOptions`](../interfaces/types.JWTClaimVerificationOptions.md) | JWT Claims Set validation options. |

#### Returns

[`UnsecuredResult`](../interfaces/jwt_unsecured.UnsecuredResult.md)\<`PayloadType`\>

___

### encode

▸ **encode**(): `string`

Encodes the Unsecured JWT.

#### Returns

`string`

___

### setAudience

▸ **setAudience**(`audience`): `this`

Set the "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

___

### setExpirationTime

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

___

### setIssuedAt

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "iat" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

___

### setIssuer

▸ **setIssuer**(`issuer`): `this`

Set the "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

`this`

___

### setJti

▸ **setJti**(`jwtId`): `this`

Set the "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

___

### setNotBefore

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "nbf" (Not Before) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

___

### setSubject

▸ **setSubject**(`subject`): `this`

Set the "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

`this`
