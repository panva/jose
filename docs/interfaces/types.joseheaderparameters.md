# Interface: JoseHeaderParameters

[types](../modules/types.md).JoseHeaderParameters

## Hierarchy

- **`JoseHeaderParameters`**

  ↳ [`JWSHeaderParameters`](types.jwsheaderparameters.md)

  ↳ [`JWEHeaderParameters`](types.jweheaderparameters.md)

## Table of contents

### Properties

- [cty](types.joseheaderparameters.md#cty)
- [jku](types.joseheaderparameters.md#jku)
- [jwk](types.joseheaderparameters.md#jwk)
- [kid](types.joseheaderparameters.md#kid)
- [typ](types.joseheaderparameters.md#typ)
- [x5c](types.joseheaderparameters.md#x5c)
- [x5t](types.joseheaderparameters.md#x5t)
- [x5u](types.joseheaderparameters.md#x5u)

## Properties

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter.

#### Defined in

[types.d.ts:271](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L271)

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter.

#### Defined in

[types.d.ts:256](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L256)

___

### jwk

• `Optional` **jwk**: `Pick`<[`JWK`](types.jwk.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

#### Defined in

[types.d.ts:261](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L261)

___

### kid

• `Optional` **kid**: `string`

"kid" (Key ID) Header Parameter.

#### Defined in

[types.d.ts:236](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L236)

___

### typ

• `Optional` **typ**: `string`

"typ" (Type) Header Parameter.

#### Defined in

[types.d.ts:266](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L266)

___

### x5c

• `Optional` **x5c**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter.

#### Defined in

[types.d.ts:246](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L246)

___

### x5t

• `Optional` **x5t**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

#### Defined in

[types.d.ts:241](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L241)

___

### x5u

• `Optional` **x5u**: `string`

"x5u" (X.509 URL) Header Parameter.

#### Defined in

[types.d.ts:251](https://github.com/panva/jose/blob/v3.14.0/src/types.d.ts#L251)
