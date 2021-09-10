# Class: EncryptJWT

[jwt/encrypt](../modules/jwt_encrypt.md).EncryptJWT

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
import { EncryptJWT } from 'https://deno.land/x/jose@v3.17.0/jwt/encrypt.ts'
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

## Hierarchy

- `ProduceJWT`

  ↳ **`EncryptJWT`**

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

#### Inherited from

ProduceJWT.constructor

#### Defined in

[lib/jwt_producer.ts:15](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L15)

## Methods

### encrypt

▸ **encrypt**(`key`, `options?`): `Promise`<`string`\>

Encrypts and returns the JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Public Key or Secret to encrypt the JWT with. |
| `options?` | [`EncryptOptions`](../interfaces/types.EncryptOptions.md) | JWE Encryption options. |

#### Returns

`Promise`<`string`\>

#### Defined in

[jwt/encrypt.ts:154](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L154)

___

### replicateAudienceAsHeader

▸ **replicateAudienceAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

#### Defined in

[jwt/encrypt.ts:143](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L143)

___

### replicateIssuerAsHeader

▸ **replicateIssuerAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

#### Defined in

[jwt/encrypt.ts:125](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L125)

___

### replicateSubjectAsHeader

▸ **replicateSubjectAsHeader**(): [`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

#### Returns

[`EncryptJWT`](jwt_encrypt.EncryptJWT.md)

#### Defined in

[jwt/encrypt.ts:134](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L134)

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

#### Inherited from

ProduceJWT.setAudience

#### Defined in

[lib/jwt_producer.ts:47](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L47)

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

#### Defined in

[jwt/encrypt.ts:97](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L97)

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

#### Inherited from

ProduceJWT.setExpirationTime

#### Defined in

[lib/jwt_producer.ts:85](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L85)

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

#### Defined in

[jwt/encrypt.ts:113](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L113)

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

#### Inherited from

ProduceJWT.setIssuedAt

#### Defined in

[lib/jwt_producer.ts:100](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L100)

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

#### Inherited from

ProduceJWT.setIssuer

#### Defined in

[lib/jwt_producer.ts:27](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L27)

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

#### Inherited from

ProduceJWT.setJti

#### Defined in

[lib/jwt_producer.ts:57](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L57)

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

#### Defined in

[jwt/encrypt.ts:81](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L81)

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

#### Inherited from

ProduceJWT.setNotBefore

#### Defined in

[lib/jwt_producer.ts:69](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L69)

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

#### Defined in

[jwt/encrypt.ts:65](https://github.com/panva/jose/blob/v3.17.0/src/jwt/encrypt.ts#L65)

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

#### Inherited from

ProduceJWT.setSubject

#### Defined in

[lib/jwt_producer.ts:37](https://github.com/panva/jose/blob/v3.17.0/src/lib/jwt_producer.ts#L37)
