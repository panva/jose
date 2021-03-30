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

Defined in: [types.d.ts:214](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L214)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), *kty* \| *crv* \| *x* \| *y* \| *e* \| *n*\>

"jwk" (JSON Web Key) Header Parameter.

Defined in: [types.d.ts:204](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L204)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Defined in: [types.d.ts:184](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L184)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Defined in: [types.d.ts:209](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L209)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Defined in: [types.d.ts:194](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L194)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Defined in: [types.d.ts:189](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L189)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Defined in: [types.d.ts:199](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L199)
