# Class: EncryptJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

The EncryptJWT class is used to build and encrypt Compact JWE formatted JSON Web Tokens.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jwt/encrypt'`.

## Example

```js
const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
const jwt = await new jose.EncryptJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encrypt(secret)

console.log(jwt)
```

## Constructors

### new EncryptJWT()

▸ **new EncryptJWT**(`payload`): [`EncryptJWT`](EncryptJWT.md)

[EncryptJWT](EncryptJWT.md) constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

#### Returns

[`EncryptJWT`](EncryptJWT.md)

## Methods

### encrypt()

▸ **encrypt**(`key`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Encrypts and returns the JWT.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md) | Public Key or Secret to encrypt the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options`? | [`EncryptOptions`](../../../types/interfaces/EncryptOptions.md) | JWE Encryption options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

***

### replicateAudienceAsHeader()

▸ **replicateAudienceAsHeader**(): `this`

Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter.

#### Returns

`this`

#### See

[RFC7519#section-5.3](https://www.rfc-editor.org/rfc/rfc7519#section-5.3)

***

### replicateIssuerAsHeader()

▸ **replicateIssuerAsHeader**(): `this`

Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter.

#### Returns

`this`

#### See

[RFC7519#section-5.3](https://www.rfc-editor.org/rfc/rfc7519#section-5.3)

***

### replicateSubjectAsHeader()

▸ **replicateSubjectAsHeader**(): `this`

Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter.

#### Returns

`this`

#### See

[RFC7519#section-5.3](https://www.rfc-editor.org/rfc/rfc7519#section-5.3)

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

### ~~setContentEncryptionKey()~~

▸ **setContentEncryptionKey**(`cek`): `this`

Sets a content encryption key to use, by default a random suitable one is generated for the JWE
enc" (Encryption Algorithm) Header Parameter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cek` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Content Encryption Key. |

#### Returns

`this`

#### Deprecated

You should not use this method. It is only really intended for test and vector
  validation purposes.

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

### ~~setInitializationVector()~~

▸ **setInitializationVector**(`iv`): `this`

Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
one is generated for the JWE enc" (Encryption Algorithm) Header Parameter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iv` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Initialization Vector. |

#### Returns

`this`

#### Deprecated

You should not use this method. It is only really intended for test and vector
  validation purposes.

***

### setIssuedAt()

▸ **setIssuedAt**(`input`?): `this`

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
| `input`? | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | "iat" (Expiration Time) Claim value to set on the JWT Claims Set. |

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

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `this`

Sets the JWE Key Management parameters to be used when encrypting. Use of this is method is
really only needed for ECDH based algorithms when utilizing the Agreement PartyUInfo or
Agreement PartyVInfo parameters. Other parameters will always be randomly generated when needed
and missing.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

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

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the JWE Protected Header on the EncryptJWT object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`CompactJWEHeaderParameters`](../../../types/interfaces/CompactJWEHeaderParameters.md) | JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc" (JWE Encryption Algorithm) properties. |

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
