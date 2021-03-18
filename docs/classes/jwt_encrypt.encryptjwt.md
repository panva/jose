# Class: EncryptJWT

[jwt/encrypt](../modules/jwt_encrypt.md).EncryptJWT

The EncryptJWT class is a utility for creating Compact JWE formatted JWT strings.

**`example`** 
```js
// ESM import
import { EncryptJWT } from 'jose/jwt/encrypt'
```

**`example`** 
```js
// CJS import
const { EncryptJWT } = require('jose/jwt/encrypt')
```

**`example`** 
```js
// usage
const secretKey = Uint8Array.from([
  206, 203, 53, 165, 235, 214, 153, 188,
  248, 225,  1, 132, 105, 204,  75,  42,
  186, 185, 24, 223, 136,  66, 116,  59,
  183, 155, 52,  52, 101, 167, 201,  85
])
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

* *ProduceJWT*

  ↳ **EncryptJWT**

## Table of contents

### Constructors

- [constructor](jwt_encrypt.encryptjwt.md#constructor)

### Methods

- [encrypt](jwt_encrypt.encryptjwt.md#encrypt)
- [replicateAudienceAsHeader](jwt_encrypt.encryptjwt.md#replicateaudienceasheader)
- [replicateIssuerAsHeader](jwt_encrypt.encryptjwt.md#replicateissuerasheader)
- [replicateSubjectAsHeader](jwt_encrypt.encryptjwt.md#replicatesubjectasheader)
- [setAudience](jwt_encrypt.encryptjwt.md#setaudience)
- [setContentEncryptionKey](jwt_encrypt.encryptjwt.md#setcontentencryptionkey)
- [setExpirationTime](jwt_encrypt.encryptjwt.md#setexpirationtime)
- [setInitializationVector](jwt_encrypt.encryptjwt.md#setinitializationvector)
- [setIssuedAt](jwt_encrypt.encryptjwt.md#setissuedat)
- [setIssuer](jwt_encrypt.encryptjwt.md#setissuer)
- [setJti](jwt_encrypt.encryptjwt.md#setjti)
- [setKeyManagementParameters](jwt_encrypt.encryptjwt.md#setkeymanagementparameters)
- [setNotBefore](jwt_encrypt.encryptjwt.md#setnotbefore)
- [setProtectedHeader](jwt_encrypt.encryptjwt.md#setprotectedheader)
- [setSubject](jwt_encrypt.encryptjwt.md#setsubject)

## Constructors

### constructor

\+ **new EncryptJWT**(`payload`: [*JWTPayload*](../interfaces/types.jwtpayload.md)): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`payload` | [*JWTPayload*](../interfaces/types.jwtpayload.md) | The JWT Claims Set object.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:10](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L10)

## Methods

### encrypt

▸ **encrypt**(`key`: [*KeyLike*](../types/types.keylike.md), `options?`: [*EncryptOptions*](../interfaces/types.encryptoptions.md)): *Promise*<string\>

Encrypts and returns the JWT.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | [*KeyLike*](../types/types.keylike.md) | Public Key or Secret to encrypt the JWT with.   |
`options?` | [*EncryptOptions*](../interfaces/types.encryptoptions.md) | JWE Encryption options.    |

**Returns:** *Promise*<string\>

Defined in: [jwt/encrypt.ts:160](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L160)

___

### replicateAudienceAsHeader

▸ **replicateAudienceAsHeader**(): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:149](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L149)

___

### replicateIssuerAsHeader

▸ **replicateIssuerAsHeader**(): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:131](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L131)

___

### replicateSubjectAsHeader

▸ **replicateSubjectAsHeader**(): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:140](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L140)

___

### setAudience

▸ **setAudience**(`audience`: *string* \| *string*[]): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "aud" (Audience) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`audience` | *string* \| *string*[] | "aud" (Audience) Claim value to set on the JWT Claims Set.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:47](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L47)

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`: *Uint8Array*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Sets a content encryption key to use, by default a random suitable one
is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
You do not need to invoke this method, it is only really intended for
test and vector validation purposes.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`cek` | *Uint8Array* | JWE Content Encryption Key.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:103](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L103)

___

### setExpirationTime

▸ **setExpirationTime**(`input`: *string* \| *number*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "exp" (Expiration Time) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`input` | *string* \| *number* | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:85](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L85)

___

### setInitializationVector

▸ **setInitializationVector**(`iv`: *Uint8Array*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Sets the JWE Initialization Vector to use for content encryption, by default
a random suitable one is generated for the JWE enc" (Encryption Algorithm)
Header Parameter. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`iv` | *Uint8Array* | JWE Initialization Vector.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:119](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L119)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`: *number*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "iat" (Issued At) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`input?` | *number* | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:100](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L100)

___

### setIssuer

▸ **setIssuer**(`issuer`: *string*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "iss" (Issuer) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`issuer` | *string* | "Issuer" Claim value to set on the JWT Claims Set.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:27](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L27)

___

### setJti

▸ **setJti**(`jwtId`: *string*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "jti" (JWT ID) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`jwtId` | *string* | "jti" (JWT ID) Claim value to set on the JWT Claims Set.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:57](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L57)

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`: [*JWEKeyManagementHeaderParameters*](../interfaces/types.jwekeymanagementheaderparameters.md)): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Sets the JWE Key Management parameters to be used when encrypting.
Use of this is method is really only needed for ECDH-ES based algorithms
when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
Other parameters will always be randomly generated when needed and missing.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parameters` | [*JWEKeyManagementHeaderParameters*](../interfaces/types.jwekeymanagementheaderparameters.md) | JWE Key Management parameters.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:87](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L87)

___

### setNotBefore

▸ **setNotBefore**(`input`: *string* \| *number*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "nbf" (Not Before) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`input` | *string* \| *number* | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:69](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L69)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Sets the JWE Protected Header on the EncryptJWT object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`protectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc" (JWE Encryption Algorithm) properties.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Defined in: [jwt/encrypt.ts:71](https://github.com/panva/jose/blob/v3.10.0/src/jwt/encrypt.ts#L71)

___

### setSubject

▸ **setSubject**(`subject`: *string*): [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Set "sub" (Subject) Claim.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`subject` | *string* | "sub" (Subject) Claim value to set on the JWT Claims Set.    |

**Returns:** [*EncryptJWT*](jwt_encrypt.encryptjwt.md)

Inherited from: void

Defined in: [lib/jwt_producer.ts:37](https://github.com/panva/jose/blob/v3.10.0/src/lib/jwt_producer.ts#L37)
