# Class: UnsecuredJWT

[jwt/unsecured](../modules/jwt_unsecured.md).UnsecuredJWT

The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.

**`example`** ESM import
```js
import { UnsecuredJWT } from 'jose/jwt/unsecured'
```

**`example`** CJS import
```js
const { UnsecuredJWT } = require('jose/jwt/unsecured')
```

**`example`** Encoding
```js *
const unsecuredJwt = new UnsecuredJWT({ 'urn:example:claim': true })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode()

console.log(unsecuredJwt)
```

**`example`** Decoding
```js *
const payload = new UnsecuredJWT.decode(jwt, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(payload)
```

## Hierarchy

- *ProduceJWT*

  ↳ **UnsecuredJWT**

## Table of contents

### Constructors

- [constructor](jwt_unsecured.unsecuredjwt.md#constructor)

### Methods

- [encode](jwt_unsecured.unsecuredjwt.md#encode)
- [setAudience](jwt_unsecured.unsecuredjwt.md#setaudience)
- [setExpirationTime](jwt_unsecured.unsecuredjwt.md#setexpirationtime)
- [setIssuedAt](jwt_unsecured.unsecuredjwt.md#setissuedat)
- [setIssuer](jwt_unsecured.unsecuredjwt.md#setissuer)
- [setJti](jwt_unsecured.unsecuredjwt.md#setjti)
- [setNotBefore](jwt_unsecured.unsecuredjwt.md#setnotbefore)
- [setSubject](jwt_unsecured.unsecuredjwt.md#setsubject)
- [decode](jwt_unsecured.unsecuredjwt.md#decode)

## Constructors

### constructor

\+ **new UnsecuredJWT**(`payload`: [*JWTPayload*](../interfaces/types.jwtpayload.md)): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [*JWTPayload*](../interfaces/types.jwtpayload.md) | The JWT Claims Set object. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.constructor

Defined in: [lib/jwt_producer.ts:10](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L10)

## Methods

### encode

▸ **encode**(): *string*

Encodes the Unsecured JWT.

**Returns:** *string*

Defined in: [jwt/unsecured.ts:49](https://github.com/panva/jose/blob/v3.12.3/src/jwt/unsecured.ts#L49)

___

### setAudience

▸ **setAudience**(`audience`: *string* \| *string*[]): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | *string* \| *string*[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setAudience

Defined in: [lib/jwt_producer.ts:47](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L47)

___

### setExpirationTime

▸ **setExpirationTime**(`input`: *string* \| *number*): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | *string* \| *number* | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setExpirationTime

Defined in: [lib/jwt_producer.ts:85](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L85)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`: *number*): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | *number* | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setIssuedAt

Defined in: [lib/jwt_producer.ts:100](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L100)

___

### setIssuer

▸ **setIssuer**(`issuer`: *string*): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | *string* | "Issuer" Claim value to set on the JWT Claims Set. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setIssuer

Defined in: [lib/jwt_producer.ts:27](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L27)

___

### setJti

▸ **setJti**(`jwtId`: *string*): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | *string* | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setJti

Defined in: [lib/jwt_producer.ts:57](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L57)

___

### setNotBefore

▸ **setNotBefore**(`input`: *string* \| *number*): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | *string* \| *number* | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setNotBefore

Defined in: [lib/jwt_producer.ts:69](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L69)

___

### setSubject

▸ **setSubject**(`subject`: *string*): [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Set "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | *string* | "sub" (Subject) Claim value to set on the JWT Claims Set. |

**Returns:** [*UnsecuredJWT*](jwt_unsecured.unsecuredjwt.md)

Inherited from: ProduceJWT.setSubject

Defined in: [lib/jwt_producer.ts:37](https://github.com/panva/jose/blob/v3.12.3/src/lib/jwt_producer.ts#L37)

___

### decode

▸ `Static` **decode**(`jwt`: *string*, `options?`: [*JWTClaimVerificationOptions*](../interfaces/types.jwtclaimverificationoptions.md)): *object*

Decodes an unsecured JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | *string* | Unsecured JWT to decode the payload of. |
| `options?` | [*JWTClaimVerificationOptions*](../interfaces/types.jwtclaimverificationoptions.md) | JWT Claims Set validation options. |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `header` | [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md) |
| `payload` | [*JWTPayload*](../interfaces/types.jwtpayload.md) |

Defined in: [jwt/unsecured.ts:62](https://github.com/panva/jose/blob/v3.12.3/src/jwt/unsecured.ts#L62)
