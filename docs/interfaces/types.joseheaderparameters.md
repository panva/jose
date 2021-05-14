# Interface: JoseHeaderParameters

[types](../modules/types.md).JoseHeaderParameters

## Hierarchy

- **JoseHeaderParameters**

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

Defined in: [types.d.ts:264](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L264)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

Defined in: [types.d.ts:254](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L254)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Defined in: [types.d.ts:234](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L234)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Defined in: [types.d.ts:259](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L259)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Defined in: [types.d.ts:244](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L244)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Defined in: [types.d.ts:239](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L239)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Defined in: [types.d.ts:249](https://github.com/panva/jose/blob/v3.12.1/src/types.d.ts#L249)
