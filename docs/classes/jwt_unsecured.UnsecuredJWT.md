# Class: UnsecuredJWT

The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.

**`example`** Encoding
```js
const unsecuredJwt = new jose.UnsecuredJWT({ 'urn:example:claim': true })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode()

console.log(unsecuredJwt)
```

**`example`** Decoding
```js
const payload = new jose.UnsecuredJWT.decode(jwt, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(payload)
```

## Table of contents

### Constructors

- [constructor](jwt_unsecured.UnsecuredJWT.md#constructor)

### Methods

- [encode](jwt_unsecured.UnsecuredJWT.md#encode)
- [setAudience](jwt_unsecured.UnsecuredJWT.md#setaudience)
- [setExpirationTime](jwt_unsecured.UnsecuredJWT.md#setexpirationtime)
- [setIssuedAt](jwt_unsecured.UnsecuredJWT.md#setissuedat)
- [setIssuer](jwt_unsecured.UnsecuredJWT.md#setissuer)
- [setJti](jwt_unsecured.UnsecuredJWT.md#setjti)
- [setNotBefore](jwt_unsecured.UnsecuredJWT.md#setnotbefore)
- [setSubject](jwt_unsecured.UnsecuredJWT.md#setsubject)
- [decode](jwt_unsecured.UnsecuredJWT.md#decode)

## Constructors

### constructor

• **new UnsecuredJWT**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. |

## Methods

### encode

▸ **encode**(): `string`

Encodes the Unsecured JWT.

#### Returns

`string`

___

### setAudience

▸ **setAudience**(`audience`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `number` | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### decode

▸ `Static` **decode**(`jwt`, `options?`): [`UnsecuredResult`](../interfaces/jwt_unsecured.UnsecuredResult.md)

Decodes an unsecured JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` | Unsecured JWT to decode the payload of. |
| `options?` | [`JWTClaimVerificationOptions`](../interfaces/types.JWTClaimVerificationOptions.md) | JWT Claims Set validation options. |

#### Returns

[`UnsecuredResult`](../interfaces/jwt_unsecured.UnsecuredResult.md)
