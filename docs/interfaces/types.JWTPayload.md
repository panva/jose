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

[types.d.ts:587](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L587)

___

### exp

• `Optional` **exp**: `number`

JWT Expiration Time - [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).

#### Defined in

[types.d.ts:602](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L602)

___

### iat

• `Optional` **iat**: `number`

JWT Issued At - [RFC7519#section-4.1.6](https://tools.ietf.org/html/rfc7519#section-4.1.6).

#### Defined in

[types.d.ts:607](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L607)

___

### iss

• `Optional` **iss**: `string`

JWT Issuer - [RFC7519#section-4.1.1](https://tools.ietf.org/html/rfc7519#section-4.1.1).

#### Defined in

[types.d.ts:577](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L577)

___

### jti

• `Optional` **jti**: `string`

JWT ID - [RFC7519#section-4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7).

#### Defined in

[types.d.ts:592](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L592)

___

### nbf

• `Optional` **nbf**: `number`

JWT Not Before - [RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).

#### Defined in

[types.d.ts:597](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L597)

___

### sub

• `Optional` **sub**: `string`

JWT Subject - [RFC7519#section-4.1.2](https://tools.ietf.org/html/rfc7519#section-4.1.2).

#### Defined in

[types.d.ts:582](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L582)
