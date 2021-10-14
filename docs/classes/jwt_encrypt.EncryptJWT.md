# Class: EncryptJWT

The EncryptJWT class is a utility for creating Compact JWE formatted JWT strings.

**`example`** ESM import
```js
import { EncryptJWT } from 'jose/jwt/encrypt'
```

**`example`** CJS import
```js
const { EncryptJWT } = require('jose/jwt/encrypt')
```

**`example`** Deno import
```js
import { EncryptJWT } from 'https://deno.land/x/jose@v3.20.2/jwt/encrypt.ts'
```

**`example`** Usage
```js
const jwt = await new EncryptJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encrypt(secretKey)

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

• **new EncryptJWT**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. |

## Methods

### encrypt

▸ **encrypt**(`key`, `options?`): `Promise`<`string`\>

Encrypts and returns the JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Public Key or Secret to encrypt the JWT with. |
| `options?` | [`EncryptOptions`](../interfaces/types.EncryptOptions.md) | JWE Encryption options. |

#### Returns

`Promise`<`string`\>

___

### replicateAudienceAsHeader

▸ **replicateAudienceAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### replicateIssuerAsHeader

▸ **replicateIssuerAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### replicateSubjectAsHeader

▸ **replicateSubjectAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setAudience

▸ **setAudience**(`audience`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets a content encryption key to use, by default a random suitable one
is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
You do not need to invoke this method, it is only really intended for
test and vector validation purposes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cek` | `Uint8Array` | JWE Content Encryption Key. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setInitializationVector

▸ **setInitializationVector**(`iv`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets the JWE Initialization Vector to use for content encryption, by default
a random suitable one is generated for the JWE enc" (Encryption Algorithm)
Header Parameter. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iv` | `Uint8Array` | JWE Initialization Vector. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `number` | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets the JWE Key Management parameters to be used when encrypting.
Use of this is method is really only needed for ECDH-ES based algorithms
when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
Other parameters will always be randomly generated when needed and missing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameters` | [`JWEKeyManagementHeaderParameters`](../interfaces/types.JWEKeyManagementHeaderParameters.md) | JWE Key Management parameters. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Sets the JWE Protected Header on the EncryptJWT object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](../interfaces/types.JWEHeaderParameters.md) | JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc" (JWE Encryption Algorithm) properties. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Set "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)
