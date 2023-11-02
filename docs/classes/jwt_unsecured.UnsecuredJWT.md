# Class: UnsecuredJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.

**`Example`**

Encoding

```js
const unsecuredJwt = new jose.UnsecuredJWT({ 'urn:example:claim': true })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encode()

console.log(unsecuredJwt)
```

**`Example`**

Decoding

```js
const payload = jose.UnsecuredJWT.decode(jwt, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(payload)
```

## Table of contents

### Constructors

- [constructor](jwt_unsecured.UnsecuredJWT.md#constructor)

### Methods

- [decode](jwt_unsecured.UnsecuredJWT.md#decode)
- [encode](jwt_unsecured.UnsecuredJWT.md#encode)
- [setAudience](jwt_unsecured.UnsecuredJWT.md#setaudience)
- [setExpirationTime](jwt_unsecured.UnsecuredJWT.md#setexpirationtime)
- [setIssuedAt](jwt_unsecured.UnsecuredJWT.md#setissuedat)
- [setIssuer](jwt_unsecured.UnsecuredJWT.md#setissuer)
- [setJti](jwt_unsecured.UnsecuredJWT.md#setjti)
- [setNotBefore](jwt_unsecured.UnsecuredJWT.md#setnotbefore)
- [setSubject](jwt_unsecured.UnsecuredJWT.md#setsubject)

## Constructors

### constructor

• **new UnsecuredJWT**(`payload?`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`JWTPayload`](../interfaces/types.JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

## Methods

### decode

▸ **decode**<`PayloadType`\>(`jwt`, `options?`): [`UnsecuredResult`](../interfaces/jwt_unsecured.UnsecuredResult.md)<`PayloadType`\>

Decodes an unsecured JWT.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | [`JWTPayload`](../interfaces/types.JWTPayload.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` | Unsecured JWT to decode the payload of. |
| `options?` | [`JWTClaimVerificationOptions`](../interfaces/types.JWTClaimVerificationOptions.md) | JWT Claims Set validation options. |

#### Returns

[`UnsecuredResult`](../interfaces/jwt_unsecured.UnsecuredResult.md)<`PayloadType`\>

___

### encode

▸ **encode**(): `string`

Encodes the Unsecured JWT.

#### Returns

`string`

___

### setAudience

▸ **setAudience**(`audience`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "aud" (Audience) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audience` | `string` \| `string`[] | "aud" (Audience) Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setExpirationTime

▸ **setExpirationTime**(`input`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "exp" (Expiration Time) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setIssuedAt

▸ **setIssuedAt**(`input?`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "iat" (Issued At) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `number` \| [`Date`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current timestamp. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setIssuer

▸ **setIssuer**(`issuer`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "iss" (Issuer) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | "Issuer" Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setJti

▸ **setJti**(`jwtId`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "jti" (JWT ID) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwtId` | `string` | "jti" (JWT ID) Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setNotBefore

▸ **setNotBefore**(`input`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "nbf" (Not Before) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `number` \| [`Date`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date ) | "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed that is used as a value, when string is passed it is resolved to a time span and added to the current timestamp. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

___

### setSubject

▸ **setSubject**(`subject`): [`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)

Set the "sub" (Subject) Claim.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `string` | "sub" (Subject) Claim value to set on the JWT Claims Set. |

#### Returns

[`UnsecuredJWT`](jwt_unsecured.UnsecuredJWT.md)
