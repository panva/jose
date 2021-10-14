# Class: SignJWT

The SignJWT class is a utility for creating Compact JWS formatted JWT strings.

**`example`** ESM import
```js
import { SignJWT } from 'jose/jwt/sign'
```

**`example`** CJS import
```js
const { SignJWT } = require('jose/jwt/sign')
```

**`example`** Deno import
```js
import { SignJWT } from 'https://deno.land/x/jose@v3.20.3/jwt/sign.ts'
```

**`example`** Usage
```js
const jwt = await new SignJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'ES256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .sign(privateKey)

console.log(jwt)
```

## Table of contents

### Constructors

- [constructor](jwt_sign.SignJWT.md#constructor)

### Methods

- [setAudience](jwt_sign.SignJWT.md#setaudience)
- [setExpirationTime](jwt_sign.SignJWT.md#setexpirationtime)
- [setIssuedAt](jwt_sign.SignJWT.md#setissuedat)
- [setIssuer](jwt_sign.SignJWT.md#setissuer)
- [setJti](jwt_sign.SignJWT.md#setjti)
- [setNotBefore](jwt_sign.SignJWT.md#setnotbefore)
- [setProtectedHeader](jwt_sign.SignJWT.md#setprotectedheader)
- [setSubject](jwt_sign.SignJWT.md#setsubject)
- [sign](jwt_sign.SignJWT.md#sign)

## Constructors

### constructor

• **new SignJWT**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. |

## Methods

### setAudience

▸ **setAudience**(`audience`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `number` | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`SignJWT`](jwt_sign.SignJWT.md)

Sets the JWS Protected Header on the SignJWT object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`SignJWT`](jwt_sign.SignJWT.md)

Set "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`SignJWT`](jwt_sign.SignJWT.md)

___

### sign

▸ **sign**(`key`, `options?`): `Promise`<`string`\>

Signs and returns the JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to sign the JWT with. |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWT Sign options. |

#### Returns

`Promise`<`string`\>
