# Class: EncryptJWT

The EncryptJWT class is a utility for creating Compact JWE formatted JWT strings.

**`example`** 
```js
// ESM import
import EncryptJWT from 'jose/jwt/encrypt'
```

**`example`** 
```js
// CJS import
const { default: EncryptJWT } = require('jose/jwt/encrypt')
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

## Index

### Constructors

* [constructor](_jwt_encrypt_.encryptjwt.md#constructor)

### Methods

* [encrypt](_jwt_encrypt_.encryptjwt.md#encrypt)
* [replicateAudienceAsHeader](_jwt_encrypt_.encryptjwt.md#replicateaudienceasheader)
* [replicateIssuerAsHeader](_jwt_encrypt_.encryptjwt.md#replicateissuerasheader)
* [replicateSubjectAsHeader](_jwt_encrypt_.encryptjwt.md#replicatesubjectasheader)
* [setAudience](_jwt_encrypt_.encryptjwt.md#setaudience)
* [setContentEncryptionKey](_jwt_encrypt_.encryptjwt.md#setcontentencryptionkey)
* [setExpirationTime](_jwt_encrypt_.encryptjwt.md#setexpirationtime)
* [setInitializationVector](_jwt_encrypt_.encryptjwt.md#setinitializationvector)
* [setIssuedAt](_jwt_encrypt_.encryptjwt.md#setissuedat)
* [setIssuer](_jwt_encrypt_.encryptjwt.md#setissuer)
* [setJti](_jwt_encrypt_.encryptjwt.md#setjti)
* [setKeyManagementParameters](_jwt_encrypt_.encryptjwt.md#setkeymanagementparameters)
* [setNotBefore](_jwt_encrypt_.encryptjwt.md#setnotbefore)
* [setProtectedHeader](_jwt_encrypt_.encryptjwt.md#setprotectedheader)
* [setSubject](_jwt_encrypt_.encryptjwt.md#setsubject)

## Constructors

### constructor

\+ **new EncryptJWT**(`payload`: [JWTPayload](../interfaces/_types_d_.jwtpayload.md)): [EncryptJWT](_jwt_encrypt_.encryptjwt.md)

*Defined in [src/lib/jwt_producer.ts:10](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L10)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`payload` | [JWTPayload](../interfaces/_types_d_.jwtpayload.md) | The JWT Claims Set object.  |

**Returns:** [EncryptJWT](_jwt_encrypt_.encryptjwt.md)

## Methods

### encrypt

▸ **encrypt**(`key`: [KeyLike](../types/_types_d_.keylike.md), `options?`: [EncryptOptions](../interfaces/_types_d_.encryptoptions.md)): Promise\<string>

*Defined in [src/jwt/encrypt.ts:160](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L160)*

Encrypts and returns the JWT.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Public Key or Secret to encrypt the JWT with. |
`options?` | [EncryptOptions](../interfaces/_types_d_.encryptoptions.md) | JWE Encryption options.  |

**Returns:** Promise\<string>

___

### replicateAudienceAsHeader

▸ **replicateAudienceAsHeader**(): this

*Defined in [src/jwt/encrypt.ts:149](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L149)*

Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

**Returns:** this

___

### replicateIssuerAsHeader

▸ **replicateIssuerAsHeader**(): this

*Defined in [src/jwt/encrypt.ts:131](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L131)*

Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

**Returns:** this

___

### replicateSubjectAsHeader

▸ **replicateSubjectAsHeader**(): this

*Defined in [src/jwt/encrypt.ts:140](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L140)*

Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter as per
[RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).

**Returns:** this

___

### setAudience

▸ **setAudience**(`audience`: string \| string[]): this

*Defined in [src/lib/jwt_producer.ts:47](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L47)*

Set "aud" (Audience) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`audience` | string \| string[] | "aud" (Audience) Claim value to set on the JWT Claims Set.  |

**Returns:** this

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`: Uint8Array): this

*Defined in [src/jwt/encrypt.ts:103](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L103)*

Sets a content encryption key to use, by default a random suitable one
is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
You do not need to invoke this method, it is only really intended for
test and vector validation purposes.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cek` | Uint8Array | JWE Content Encryption Key.  |

**Returns:** this

___

### setExpirationTime

▸ **setExpirationTime**(`input`: number \| string): this

*Defined in [src/lib/jwt_producer.ts:85](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L85)*

Set "exp" (Expiration Time) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`input` | number \| string | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp.  |

**Returns:** this

___

### setInitializationVector

▸ **setInitializationVector**(`iv`: Uint8Array): this

*Defined in [src/jwt/encrypt.ts:119](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L119)*

Sets the JWE Initialization Vector to use for content encryption, by default
a random suitable one is generated for the JWE enc" (Encryption Algorithm)
Header Parameter. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`iv` | Uint8Array | JWE Initialization Vector.  |

**Returns:** this

___

### setIssuedAt

▸ **setIssuedAt**(`input?`: number): this

*Defined in [src/lib/jwt_producer.ts:100](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L100)*

Set "iat" (Issued At) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`input?` | number | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp.  |

**Returns:** this

___

### setIssuer

▸ **setIssuer**(`issuer`: string): this

*Defined in [src/lib/jwt_producer.ts:27](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L27)*

Set "iss" (Issuer) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`issuer` | string | "Issuer" Claim value to set on the JWT Claims Set.  |

**Returns:** this

___

### setJti

▸ **setJti**(`jwtId`: string): this

*Defined in [src/lib/jwt_producer.ts:57](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L57)*

Set "jti" (JWT ID) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`jwtId` | string | "jti" (JWT ID) Claim value to set on the JWT Claims Set.  |

**Returns:** this

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`: [JWEKeyManagementHeaderParameters](../interfaces/_types_d_.jwekeymanagementheaderparameters.md)): this

*Defined in [src/jwt/encrypt.ts:87](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L87)*

Sets the JWE Key Management parameters to be used when encrypting.
Use of this is method is really only needed for ECDH-ES based algorithms
when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
Other parameters will always be randomly generated when needed and missing.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`parameters` | [JWEKeyManagementHeaderParameters](../interfaces/_types_d_.jwekeymanagementheaderparameters.md) | JWE Key Management parameters.  |

**Returns:** this

___

### setNotBefore

▸ **setNotBefore**(`input`: number \| string): this

*Defined in [src/lib/jwt_producer.ts:69](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L69)*

Set "nbf" (Not Before) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`input` | number \| string | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp.  |

**Returns:** this

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md)): this

*Defined in [src/jwt/encrypt.ts:71](https://github.com/panva/jose/blob/v3.1.0/src/jwt/encrypt.ts#L71)*

Sets the JWE Protected Header on the EncryptJWT object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md) | JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc" (JWE Encryption Algorithm) properties.  |

**Returns:** this

___

### setSubject

▸ **setSubject**(`subject`: string): this

*Defined in [src/lib/jwt_producer.ts:37](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L37)*

Set "sub" (Subject) Claim.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`subject` | string | "sub" (Subject) Claim value to set on the JWT Claims Set.  |

**Returns:** this
