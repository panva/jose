# Class: ProduceJWT

[jwt/produce](../modules/jwt_produce.md).ProduceJWT

Generic class for JWT producing.

## Table of contents

### Constructors

- [constructor](jwt_produce.ProduceJWT.md#constructor)

### Methods

- [setAudience](jwt_produce.ProduceJWT.md#setaudience)
- [setExpirationTime](jwt_produce.ProduceJWT.md#setexpirationtime)
- [setIssuedAt](jwt_produce.ProduceJWT.md#setissuedat)
- [setIssuer](jwt_produce.ProduceJWT.md#setissuer)
- [setJti](jwt_produce.ProduceJWT.md#setjti)
- [setNotBefore](jwt_produce.ProduceJWT.md#setnotbefore)
- [setSubject](jwt_produce.ProduceJWT.md#setsubject)

## Constructors

### constructor

• **new ProduceJWT**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. |

## Methods

### setAudience

▸ **setAudience**(`audience`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `number` | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)
