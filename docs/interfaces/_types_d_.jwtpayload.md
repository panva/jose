# Interface: JWTPayload

Recognized JWT Claims Set members, any other members
may also be present.

## Indexable

▪ [propName: string]: any

Any other JWT Claim Set member.

## Index

### Properties

* [aud](_types_d_.jwtpayload.md#aud)
* [exp](_types_d_.jwtpayload.md#exp)
* [iat](_types_d_.jwtpayload.md#iat)
* [iss](_types_d_.jwtpayload.md#iss)
* [jti](_types_d_.jwtpayload.md#jti)
* [nbf](_types_d_.jwtpayload.md#nbf)
* [sub](_types_d_.jwtpayload.md#sub)

## Properties

### aud

• `Optional` **aud**: string \| string[]

*Defined in [src/types.d.ts:492](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L492)*

JWT Audience [RFC7519#section-4.1.3](https://tools.ietf.org/html/rfc7519#section-4.1.3).

___

### exp

• `Optional` **exp**: number

*Defined in [src/types.d.ts:507](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L507)*

JWT Expiration Time - [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).

___

### iat

• `Optional` **iat**: number

*Defined in [src/types.d.ts:512](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L512)*

JWT Issued At - [RFC7519#section-4.1.6](https://tools.ietf.org/html/rfc7519#section-4.1.6).

___

### iss

• `Optional` **iss**: string

*Defined in [src/types.d.ts:482](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L482)*

JWT Issuer - [RFC7519#section-4.1.1](https://tools.ietf.org/html/rfc7519#section-4.1.1).

___

### jti

• `Optional` **jti**: string

*Defined in [src/types.d.ts:497](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L497)*

JWT ID - [RFC7519#section-4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7).

___

### nbf

• `Optional` **nbf**: number

*Defined in [src/types.d.ts:502](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L502)*

JWT Not Before - [RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).

___

### sub

• `Optional` **sub**: string

*Defined in [src/types.d.ts:487](https://github.com/panva/jose/blob/v3.8.0/src/types.d.ts#L487)*

JWT Subject - [RFC7519#section-4.1.2](https://tools.ietf.org/html/rfc7519#section-4.1.2).
