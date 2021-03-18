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

Defined in: [types.d.ts:208](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L208)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), *kty* \| *crv* \| *x* \| *y* \| *e* \| *n*\>

"jwk" (JSON Web Key) Header Parameter.

Defined in: [types.d.ts:198](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L198)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Defined in: [types.d.ts:178](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L178)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Defined in: [types.d.ts:203](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L203)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Defined in: [types.d.ts:188](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L188)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Defined in: [types.d.ts:183](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L183)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Defined in: [types.d.ts:193](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L193)
