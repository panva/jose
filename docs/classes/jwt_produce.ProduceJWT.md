# Class: ProduceJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Generic class for JWT producing.

## Table of contents

### Constructors

- [constructor](jwt_produce.ProduceJWT.md#constructor)

### Methods

- [setAudience](jwt_produce.ProduceJWT.md#setaudience)
- [setExpirationTime](jwt_produce.ProduceJWT.md#setexpirationtime)
- [setIssuedAt](jwt_produce.ProduceJWT.md#setissuedat)
- [setIssuer](jwt_produce.ProduceJWT.md#setissuer)
- [setJti](jwt_produce.ProduceJWT.md#setjti)
- [setNotBefore](jwt_produce.ProduceJWT.md#setnotbefore)
- [setSubject](jwt_produce.ProduceJWT.md#setsubject)

## Constructors

### constructor

• **new ProduceJWT**(`payload?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

## Methods

### setAudience

▸ **setAudience**(`audience`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "exp" (Expiration Time) Claim.

- If a `number` is passed as an argument, it's used as the `exp` claim directly.
- If a `Date` instance is passed as an argument, the value is converted to unix timestamp and
  used as the claim.
- If a `string` is passed as an argument it is resolved to a time span, and then added to the
  current unix timestamp and used as the claim.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
"m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
"years", "yr", "yrs", and "y".

If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
subtracted from the current unix timestamp. A "from now" suffix can also be used for
readability when adding to the current unix timestamp.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "iat" (Issued At) Claim.

- If no argument is used the current unix timestamp is used as the `iat` claim.
- If a `number` is passed as an argument, it's used as the `iat` claim directly.
- If a `Date` instance is passed as an argument, the value is converted to unix timestamp and
  used as the claim.
- If a `string` is passed as an argument it is resolved to a time span, and then added to the
  current unix timestamp and used as the claim.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
"m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
"years", "yr", "yrs", and "y".

If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
subtracted from the current unix timestamp. A "from now" suffix can also be used for
readability when adding to the current unix timestamp.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "iat" (Expiration Time) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "nbf" (Not Before) Claim.

- If a `number` is passed as an argument, it's used as the claim directly.
- If a `Date` instance is passed as an argument, the value is converted to unix timestamp and
  used as the claim.
- If a `string` is passed as an argument it is resolved to a time span, and then added to the
  current unix timestamp and used as the claim.

Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
day".

Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
"m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
"years", "yr", "yrs", and "y".

If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
subtracted from the current unix timestamp. A "from now" suffix can also be used for
readability when adding to the current unix timestamp.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "nbf" (Not Before) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)
