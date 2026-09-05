# Class: EncryptJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Builds and encrypts Compact JWE-formatted JSON Web Tokens.

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

### Constructor

▸ **new EncryptJWT**(`payload?`): `EncryptJWT`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload?` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Initial JWT Claims Set. Defaults to an empty object. |

#### Returns

`EncryptJWT`

## Methods

### encrypt()

▸ **encrypt**(`key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Encrypts and returns the JWT.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../types/type-aliases/KeyInput.md) | Public key or shared secret to encrypt the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`EncryptOptions`](../../../types/interfaces/EncryptOptions.md) | JWE Encryption options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

***

### replicateAudienceAsHeader()

▸ **replicateAudienceAsHeader**(): `this`

Replicates the "aud" (Audience) Claim in the JWE Protected Header, exposing it without
decryption.

#### Returns

`this`

#### See

[RFC7519#section-5.3](https://www.rfc-editor.org/info/rfc7519/#section-5.3)

***

### replicateIssuerAsHeader()

▸ **replicateIssuerAsHeader**(): `this`

Replicates the "iss" (Issuer) Claim in the JWE Protected Header, exposing it without
decryption.

#### Returns

`this`

#### See

[RFC7519#section-5.3](https://www.rfc-editor.org/info/rfc7519/#section-5.3)

***

### replicateSubjectAsHeader()

▸ **replicateSubjectAsHeader**(): `this`

Replicates the "sub" (Subject) Claim in the JWE Protected Header, exposing it without
decryption.

#### Returns

`this`

#### See

[RFC7519#section-5.3](https://www.rfc-editor.org/info/rfc7519/#section-5.3)

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

Sets the content encryption key. By default, a suitable random key is generated for the JWE
"enc" (Encryption Algorithm). May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cek` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Content Encryption Key. |

#### Returns

`this`

#### Deprecated

For testing and vector validation only; allow random generation in production.

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

### ~~setInitializationVector()~~

▸ **setInitializationVector**(`iv`): `this`

Sets the Initialization Vector for content encryption. By default, a suitable random IV is
generated for the JWE "enc" (Encryption Algorithm). May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iv` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWE Initialization Vector. |

#### Returns

`this`

#### Deprecated

For testing and vector validation only; allow random generation in production.

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

### setKeyManagementParameters()

▸ **setKeyManagementParameters**(`parameters`): `this`

Sets JWE Key Management parameters, such as ECDH-ES "apu" and "apv" or PBES2 "p2c", and adds
them to the appropriate JOSE Header. Use this instead of the header setters for algorithm
inputs. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../../../types/interfaces/JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

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

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the JWE Protected Header. May only be called once.

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
