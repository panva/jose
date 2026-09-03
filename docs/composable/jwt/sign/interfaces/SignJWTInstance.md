# Interface: SignJWTInstance\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Interface implemented by a composed SignJWT instance.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Methods

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

Set the "exp" (Expiration Time) Claim. A `number` is used directly, a `Date` is converted to a
Unix timestamp, and a `string` is parsed as a time span relative to the current Unix timestamp.
String units may be seconds, minutes, hours, days, weeks, or years; months are unsupported and
a year is 365.25 days. A leading `-` or trailing `"ago"` subtracts the time span.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
"mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
"year", "years", "yr", "yrs", and "y".

A "from now" suffix can be used for readability when adding to the current Unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setIssuedAt()

▸ **setIssuedAt**(`input?`): `this`

Set the "iat" (Issued At) Claim. With no argument the current Unix timestamp is used. A
`number` is used directly, a `Date` is converted to a Unix timestamp, and a `string` is parsed
as a time span relative to the current Unix timestamp. String units may be seconds, minutes,
hours, days, weeks, or years; months are unsupported and a year is 365.25 days. A leading `-`
or trailing `"ago"` subtracts the time span.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
"mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
"year", "years", "yr", "yrs", and "y".

A "from now" suffix can be used for readability when adding to the current Unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input?` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "iat" (Issued At) Claim value to set on the JWT Claims Set. |

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

Set the "nbf" (Not Before) Claim. A `number` is used directly, a `Date` is converted to a Unix
timestamp, and a `string` is parsed as a time span relative to the current Unix timestamp.
String units may be seconds, minutes, hours, days, weeks, or years; months are unsupported and
a year is 365.25 days. A leading `-` or trailing `"ago"` subtracts the time span.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
"mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
"year", "years", "yr", "yrs", and "y".

A "from now" suffix can be used for readability when adding to the current Unix timestamp.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "nbf" (Not Before) Claim value to set on the JWT Claims Set. |

#### Returns

`this`

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the Protected Header on the JWS, JWE, or JWT producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`SelectedJWTHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWTHeaderParameters.md) | JOSE Protected Header accepted by this producer. |

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

▸ **sign**(`key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Signs and resolves the JWS or signed JWT.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`JWSKeyInput`](../../../../algorithms/jws/type-aliases/JWSKeyInput.md) | Private Key or Secret to sign the JWS or JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS or JWT Sign options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>
