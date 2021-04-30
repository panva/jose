# Interface: JoseHeaderParameters

[types](../modules/types.md).JoseHeaderParameters

## Hierarchy

* **JoseHeaderParameters**

  ↳ [*JWSHeaderParameters*](types.jwsheaderparameters.md)

  ↳ [*JWEHeaderParameters*](types.jweheaderparameters.md)

## Table of contents

### Properties

- [cty](types.joseheaderparameters.md#cty)
- [jwk](types.joseheaderparameters.md#jwk)
- [kid](types.joseheaderparameters.md#kid)
- [typ](types.joseheaderparameters.md#typ)
- [x5c](types.joseheaderparameters.md#x5c)
- [x5t](types.joseheaderparameters.md#x5t)
- [x5u](types.joseheaderparameters.md#x5u)

## Properties

### cty

• `Optional` **cty**: *string*

"cty" (Content Type) Header Parameter.

Defined in: [types.d.ts:260](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L260)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

Defined in: [types.d.ts:250](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L250)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Defined in: [types.d.ts:230](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L230)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Defined in: [types.d.ts:255](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L255)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Defined in: [types.d.ts:240](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L240)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Defined in: [types.d.ts:235](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L235)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Defined in: [types.d.ts:245](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L245)
