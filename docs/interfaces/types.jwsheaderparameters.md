# Interface: JWSHeaderParameters

[types](../modules/types.md).JWSHeaderParameters

Recognized JWS Header Parameters, any other Header Members
may also be present.

## Hierarchy

* [*JoseHeaderParameters*](types.joseheaderparameters.md)

  ↳ **JWSHeaderParameters**

## Indexable

▪ [propName: *string*]: *unknown*

Any other JWS Header member.

## Table of contents

### Properties

- [alg](types.jwsheaderparameters.md#alg)
- [b64](types.jwsheaderparameters.md#b64)
- [crit](types.jwsheaderparameters.md#crit)
- [cty](types.jwsheaderparameters.md#cty)
- [jwk](types.jwsheaderparameters.md#jwk)
- [kid](types.jwsheaderparameters.md#kid)
- [typ](types.jwsheaderparameters.md#typ)
- [x5c](types.jwsheaderparameters.md#x5c)
- [x5t](types.jwsheaderparameters.md#x5t)
- [x5u](types.jwsheaderparameters.md#x5u)

## Properties

### alg

• `Optional` **alg**: *string*

JWS "alg" (Algorithm) Header Parameter.

Defined in: [types.d.ts:271](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L271)

___

### b64

• `Optional` **b64**: *boolean*

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://tools.ietf.org/html/rfc7797).

Defined in: [types.d.ts:278](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L278)

___

### crit

• `Optional` **crit**: *string*[]

JWS "crit" (Critical) Header Parameter.

Defined in: [types.d.ts:283](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L283)

___

### cty

• `Optional` **cty**: *string*

"cty" (Content Type) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[cty](types.joseheaderparameters.md#cty)

Defined in: [types.d.ts:260](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L260)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[jwk](types.joseheaderparameters.md#jwk)

Defined in: [types.d.ts:250](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L250)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[kid](types.joseheaderparameters.md#kid)

Defined in: [types.d.ts:230](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L230)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[typ](types.joseheaderparameters.md#typ)

Defined in: [types.d.ts:255](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L255)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5c](types.joseheaderparameters.md#x5c)

Defined in: [types.d.ts:240](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L240)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5t](types.joseheaderparameters.md#x5t)

Defined in: [types.d.ts:235](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L235)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5u](types.joseheaderparameters.md#x5u)

Defined in: [types.d.ts:245](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L245)
