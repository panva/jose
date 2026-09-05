# Class: UnsecuredJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Encodes and decodes `{ "alg": "none" }` Unsecured JWTs.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jwt/unsecured'`.

## Examples

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

Decoding

```js
const { payload, header } = jose.UnsecuredJWT.decode(unsecuredJwt, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(header)
console.log(payload)
```

## Constructors

### Constructor

▸ **new UnsecuredJWT**(`payload?`): `UnsecuredJWT`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload?` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Initial JWT Claims Set. Defaults to an empty object. |

#### Returns

`UnsecuredJWT`

## Methods

### decode()

▸ `static` **decode**\<`PayloadType`\>(`jwt`, `options?`): [`UnsecuredResult`](../interfaces/UnsecuredResult.md)\<`PayloadType`\>

Decodes an unsecured JWT and validates its claims without authenticating the token.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` | Unsecured JWT to decode the payload of. |
| `options?` | [`JWTClaimVerificationOptions`](../../../types/interfaces/JWTClaimVerificationOptions.md) | JWT Claims Set validation options. |

#### Returns

[`UnsecuredResult`](../interfaces/UnsecuredResult.md)\<`PayloadType`\>

***

### encode()

▸ **encode**(): `string`

Encodes the Unsecured JWT.

#### Returns

`string`

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

### setExpirationTime()

▸ **setExpirationTime**(`input`): `this`

Set the "exp" (Expiration Time) Claim. Accepts a Unix timestamp in seconds, a Date, or a
duration relative to now using the same formats as [setNotBefore](../../../types/interfaces/ProduceJWT.md#setnotbefore).

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
"mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
"year", "years", "yr", "yrs", and "y".

A "from now" suffix can be used for readability when adding to the current Unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "exp" (Expiration Time) Claim value as a timestamp, Date, or relative duration. |

#### Returns

`this`

***

### setIssuedAt()

▸ **setIssuedAt**(`input?`): `this`

Set the "iat" (Issued At) Claim. Defaults to the current Unix timestamp in seconds. Accepts a
Unix timestamp in seconds, a Date, or a duration relative to now using the same formats as
[setNotBefore](../../../types/interfaces/ProduceJWT.md#setnotbefore).

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
"mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
"year", "years", "yr", "yrs", and "y".

A "from now" suffix can be used for readability when adding to the current Unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input?` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "iat" (Issued At) Claim value as a timestamp, Date, or relative duration. |

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

Set the "nbf" (Not Before) Claim. Numbers are Unix timestamps in seconds; Dates are converted
to seconds. Strings are relative to now, using seconds, minutes, hours, days, weeks, or years
(365.25 days; no months). Prefix `-` or suffix `ago` subtracts the duration.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
"mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
"year", "years", "yr", "yrs", and "y".

A "from now" suffix can be used for readability when adding to the current Unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "nbf" (Not Before) Claim value as a timestamp, Date, or relative duration. |

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
