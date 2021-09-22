# Class: SignJWT

[jwt/sign](../modules/jwt_sign.md).SignJWT

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
import { SignJWT } from 'https://deno.land/x/jose@v3.18.0/jwt/sign.ts'
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

## Hierarchy

- `ProduceJWT`

  ↳ **`SignJWT`**

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

#### Inherited from

ProduceJWT.constructor

#### Defined in

[lib/jwt_producer.ts:15](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L15)

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

#### Inherited from

ProduceJWT.setAudience

#### Defined in

[lib/jwt_producer.ts:47](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L47)

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

#### Inherited from

ProduceJWT.setExpirationTime

#### Defined in

[lib/jwt_producer.ts:85](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L85)

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

#### Inherited from

ProduceJWT.setIssuedAt

#### Defined in

[lib/jwt_producer.ts:100](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L100)

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

#### Inherited from

ProduceJWT.setIssuer

#### Defined in

[lib/jwt_producer.ts:27](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L27)

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

#### Inherited from

ProduceJWT.setJti

#### Defined in

[lib/jwt_producer.ts:57](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L57)

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

#### Inherited from

ProduceJWT.setNotBefore

#### Defined in

[lib/jwt_producer.ts:69](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L69)

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

#### Defined in

[jwt/sign.ts:46](https://github.com/panva/jose/blob/v3.18.0/src/jwt/sign.ts#L46)

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

#### Inherited from

ProduceJWT.setSubject

#### Defined in

[lib/jwt_producer.ts:37](https://github.com/panva/jose/blob/v3.18.0/src/lib/jwt_producer.ts#L37)

___

### sign

▸ **sign**(`key`, `options?`): `Promise`<`string`\>

Signs and returns the JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to sign the JWT with. |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWT Sign options. |

#### Returns

`Promise`<`string`\>

#### Defined in

[jwt/sign.ts:57](https://github.com/panva/jose/blob/v3.18.0/src/jwt/sign.ts#L57)
