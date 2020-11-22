# Class: SignJWT

The SignJWT class is a utility for creating Compact JWS formatted JWT strings.

**`example`** 
```js
// ESM import
import SignJWT from 'jose/jwt/sign'
```

**`example`** 
```js
// CJS import
const { default: SignJWT } = require('jose/jwt/sign')
```

**`example`** 
```js
// usage
import parseJwk from 'jose/jwk/parse'

const privateKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})

const jwt = await new SignJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'ES256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .sign(privateKey)

console.log(jwt)
```

## Index

### Constructors

* [constructor](_jwt_sign_.signjwt.md#constructor)

### Methods

* [setAudience](_jwt_sign_.signjwt.md#setaudience)
* [setExpirationTime](_jwt_sign_.signjwt.md#setexpirationtime)
* [setIssuedAt](_jwt_sign_.signjwt.md#setissuedat)
* [setIssuer](_jwt_sign_.signjwt.md#setissuer)
* [setJti](_jwt_sign_.signjwt.md#setjti)
* [setNotBefore](_jwt_sign_.signjwt.md#setnotbefore)
* [setProtectedHeader](_jwt_sign_.signjwt.md#setprotectedheader)
* [setSubject](_jwt_sign_.signjwt.md#setsubject)
* [sign](_jwt_sign_.signjwt.md#sign)

## Constructors

### constructor

\+ **new SignJWT**(`payload`: [JWTPayload](../interfaces/_types_d_.jwtpayload.md)): [SignJWT](_jwt_sign_.signjwt.md)

*Defined in [src/lib/jwt_producer.ts:10](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L10)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`payload` | [JWTPayload](../interfaces/_types_d_.jwtpayload.md) | The JWT Claims Set object.  |

**Returns:** [SignJWT](_jwt_sign_.signjwt.md)

## Methods

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

▸ **setProtectedHeader**(`protectedHeader`: [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md)): this

*Defined in [src/jwt/sign.ts:57](https://github.com/panva/jose/blob/v3.1.0/src/jwt/sign.ts#L57)*

Sets the JWS Protected Header on the SignJWT object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md) | JWS Protected Header.  |

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

___

### sign

▸ **sign**(`key`: [KeyLike](../types/_types_d_.keylike.md)): Promise\<string>

*Defined in [src/jwt/sign.ts:67](https://github.com/panva/jose/blob/v3.1.0/src/jwt/sign.ts#L67)*

Signs and returns the JWT.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Private Key or Secret to sign the JWT with.  |

**Returns:** Promise\<string>
