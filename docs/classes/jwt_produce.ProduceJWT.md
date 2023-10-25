# Class: ProduceJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

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

• **new ProduceJWT**(`payload?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

## Methods

### setAudience

▸ **setAudience**(`audience`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `number` \| [`Date`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`ProduceJWT`](jwt_produce.ProduceJWT.md)

Set the "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`ProduceJWT`](jwt_produce.ProduceJWT.md)
