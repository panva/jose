# Interface: JWTPayload

[types](../modules/types.md).JWTPayload

Recognized JWT Claims Set members, any other members
may also be present.

## Indexable

▪ [propName: `string`]: `unknown`

Any other JWT Claim Set member.

## Table of contents

### Properties

- [aud](types.JWTPayload.md#aud)
- [exp](types.JWTPayload.md#exp)
- [iat](types.JWTPayload.md#iat)
- [iss](types.JWTPayload.md#iss)
- [jti](types.JWTPayload.md#jti)
- [nbf](types.JWTPayload.md#nbf)
- [sub](types.JWTPayload.md#sub)

## Properties

### aud

• `Optional` **aud**: `string` \| `string`[]

JWT Audience [RFC7519#section-4.1.3](https://tools.ietf.org/html/rfc7519#section-4.1.3).

#### Defined in

[types.d.ts:559](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L559)

___

### exp

• `Optional` **exp**: `number`

JWT Expiration Time - [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).

#### Defined in

[types.d.ts:574](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L574)

___

### iat

• `Optional` **iat**: `number`

JWT Issued At - [RFC7519#section-4.1.6](https://tools.ietf.org/html/rfc7519#section-4.1.6).

#### Defined in

[types.d.ts:579](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L579)

___

### iss

• `Optional` **iss**: `string`

JWT Issuer - [RFC7519#section-4.1.1](https://tools.ietf.org/html/rfc7519#section-4.1.1).

#### Defined in

[types.d.ts:549](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L549)

___

### jti

• `Optional` **jti**: `string`

JWT ID - [RFC7519#section-4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7).

#### Defined in

[types.d.ts:564](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L564)

___

### nbf

• `Optional` **nbf**: `number`

JWT Not Before - [RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).

#### Defined in

[types.d.ts:569](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L569)

___

### sub

• `Optional` **sub**: `string`

JWT Subject - [RFC7519#section-4.1.2](https://tools.ietf.org/html/rfc7519#section-4.1.2).

#### Defined in

[types.d.ts:554](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L554)
