# Class: UnsecuredJWT

The UnsecuredJWT class is a utility for creating `{ "alg": "none" }` Unsecured JWTs.

**`example`** 
```js
// ESM import
import UnsecuredJWT from 'jose/jwt/unsecured'
```

**`example`** 
```js
// CJS import
const { default: UnsecuredJWT } = require('jose/jwt/unsecured')
```

**`example`** 
```js
// encoding

const unsecuredJwt = new UnsecuredJWT({ 'urn:example:claim': true })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode()

console.log(unsecuredJwt)
```

**`example`** 
```js
// decoding

const payload = new UnsecuredJWT.decode(jwt, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(payload)
```

## Index

### Constructors

* [constructor](_jwt_unsecured_.unsecuredjwt.md#constructor)

### Methods

* [encode](_jwt_unsecured_.unsecuredjwt.md#encode)
* [setAudience](_jwt_unsecured_.unsecuredjwt.md#setaudience)
* [setExpirationTime](_jwt_unsecured_.unsecuredjwt.md#setexpirationtime)
* [setIssuedAt](_jwt_unsecured_.unsecuredjwt.md#setissuedat)
* [setIssuer](_jwt_unsecured_.unsecuredjwt.md#setissuer)
* [setJti](_jwt_unsecured_.unsecuredjwt.md#setjti)
* [setNotBefore](_jwt_unsecured_.unsecuredjwt.md#setnotbefore)
* [setSubject](_jwt_unsecured_.unsecuredjwt.md#setsubject)
* [decode](_jwt_unsecured_.unsecuredjwt.md#decode)

## Constructors

### constructor

\+ **new UnsecuredJWT**(`payload`: [JWTPayload](../interfaces/_types_d_.jwtpayload.md)): [UnsecuredJWT](_jwt_unsecured_.unsecuredjwt.md)

*Defined in [src/lib/jwt_producer.ts:10](https://github.com/panva/jose/blob/v3.1.0/src/lib/jwt_producer.ts#L10)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`payload` | [JWTPayload](../interfaces/_types_d_.jwtpayload.md) | The JWT Claims Set object.  |

**Returns:** [UnsecuredJWT](_jwt_unsecured_.unsecuredjwt.md)

## Methods

### encode

▸ **encode**(): string

*Defined in [src/jwt/unsecured.ts:55](https://github.com/panva/jose/blob/v3.1.0/src/jwt/unsecured.ts#L55)*

Encodes the Unsecured JWT.

**Returns:** string

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

### decode

▸ `Static`**decode**(`jwt`: string, `options?`: [JWTClaimVerificationOptions](../interfaces/_types_d_.jwtclaimverificationoptions.md)): object

*Defined in [src/jwt/unsecured.ts:77](https://github.com/panva/jose/blob/v3.1.0/src/jwt/unsecured.ts#L77)*

Decodes an unsecured JWT.

**`example`** 
```js
// decoding
const { payload, header } = UnsecuredJWT.decode(unsecuredJwt)

console.log(header)
console.log(payload)
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`jwt` | string | Unsecured JWT to decode the payload of. |
`options?` | [JWTClaimVerificationOptions](../interfaces/_types_d_.jwtclaimverificationoptions.md) | JWT Claims Set validation options.  |

**Returns:** object

Name | Type |
------ | ------ |
`header` | [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md) |
`payload` | [JWTPayload](../interfaces/_types_d_.jwtpayload.md) |
