# Class: EncryptJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

The EncryptJWT class is used to build and encrypt Compact JWE formatted JSON Web Tokens.

**`Example`**

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

## Table of contents

### Constructors

- [constructor](jwt_encrypt.EncryptJWT.md#constructor)

### Methods

- [encrypt](jwt_encrypt.EncryptJWT.md#encrypt)
- [replicateAudienceAsHeader](jwt_encrypt.EncryptJWT.md#replicateaudienceasheader)
- [replicateIssuerAsHeader](jwt_encrypt.EncryptJWT.md#replicateissuerasheader)
- [replicateSubjectAsHeader](jwt_encrypt.EncryptJWT.md#replicatesubjectasheader)
- [setAudience](jwt_encrypt.EncryptJWT.md#setaudience)
- [setContentEncryptionKey](jwt_encrypt.EncryptJWT.md#setcontentencryptionkey)
- [setExpirationTime](jwt_encrypt.EncryptJWT.md#setexpirationtime)
- [setInitializationVector](jwt_encrypt.EncryptJWT.md#setinitializationvector)
- [setIssuedAt](jwt_encrypt.EncryptJWT.md#setissuedat)
- [setIssuer](jwt_encrypt.EncryptJWT.md#setissuer)
- [setJti](jwt_encrypt.EncryptJWT.md#setjti)
- [setKeyManagementParameters](jwt_encrypt.EncryptJWT.md#setkeymanagementparameters)
- [setNotBefore](jwt_encrypt.EncryptJWT.md#setnotbefore)
- [setProtectedHeader](jwt_encrypt.EncryptJWT.md#setprotectedheader)
- [setSubject](jwt_encrypt.EncryptJWT.md#setsubject)

## Constructors

### constructor

• **new EncryptJWT**(`payload?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

## Methods

### encrypt

▸ **encrypt**(`key`, `options?`): [`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`string`\>

Encrypts and returns the JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Public Key or Secret to encrypt the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`EncryptOptions`](../interfaces/types.EncryptOptions.md) | JWE Encryption options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`string`\>

___

### replicateAudienceAsHeader

▸ **replicateAudienceAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter.

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

**`See`**

[RFC7519#section-5.3](https://www.rfc-editor.org/rfc/rfc7519#section-5.3)

___

### replicateIssuerAsHeader

▸ **replicateIssuerAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter.

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

**`See`**

[RFC7519#section-5.3](https://www.rfc-editor.org/rfc/rfc7519#section-5.3)

___

### replicateSubjectAsHeader

▸ **replicateSubjectAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter.

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

**`See`**

[RFC7519#section-5.3](https://www.rfc-editor.org/rfc/rfc7519#section-5.3)

___

### setAudience

▸ **setAudience**(`audience`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set the "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets a content encryption key to use, by default a random suitable one is generated for the JWE
enc" (Encryption Algorithm) Header Parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cek` | [`Uint8Array`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | JWE Content Encryption Key. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

**`Deprecated`**

You should not use this method. It is only really intended for test and vector
  validation purposes.

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

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

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setInitializationVector

▸ **setInitializationVector**(`iv`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
one is generated for the JWE enc" (Encryption Algorithm) Header Parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iv` | [`Uint8Array`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | JWE Initialization Vector. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

**`Deprecated`**

You should not use this method. It is only really intended for test and vector
  validation purposes.

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

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

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set the "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set the "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets the JWE Key Management parameters to be used when encrypting. Use of this is method is
really only needed for ECDH based algorithms when utilizing the Agreement PartyUInfo or
Agreement PartyVInfo parameters. Other parameters will always be randomly generated when needed
and missing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../interfaces/types.JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

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

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets the JWE Protected Header on the EncryptJWT object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`CompactJWEHeaderParameters`](../interfaces/types.CompactJWEHeaderParameters.md) | JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc" (JWE Encryption Algorithm) properties. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set the "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)
