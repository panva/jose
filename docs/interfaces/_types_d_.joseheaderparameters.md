# Interface: JoseHeaderParameters

## Index

### Properties

* [cty](_types_d_.joseheaderparameters.md#cty)
* [jwk](_types_d_.joseheaderparameters.md#jwk)
* [kid](_types_d_.joseheaderparameters.md#kid)
* [typ](_types_d_.joseheaderparameters.md#typ)
* [x5c](_types_d_.joseheaderparameters.md#x5c)
* [x5t](_types_d_.joseheaderparameters.md#x5t)
* [x5u](_types_d_.joseheaderparameters.md#x5u)

## Properties

### cty

• `Optional` **cty**: string

*Defined in [src/types.d.ts:208](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L208)*

"cty" (Content Type) Header Parameter.

___

### jwk

• `Optional` **jwk**: Pick<[JWK](_types_d_.jwk.md), \"kty\" \| \"crv\" \| \"x\" \| \"y\" \| \"e\" \| \"n\"\>

*Defined in [src/types.d.ts:198](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L198)*

"jwk" (JSON Web Key) Header Parameter.

___

### kid

• `Optional` **kid**: string

*Defined in [src/types.d.ts:178](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L178)*

"kid" (Key ID) Header Parameter.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:203](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L203)*

"typ" (Type) Header Parameter.

___

### x5c

• `Optional` **x5c**: string[]

*Defined in [src/types.d.ts:188](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L188)*

"x5c" (X.509 Certificate Chain) Header Parameter.

___

### x5t

• `Optional` **x5t**: string

*Defined in [src/types.d.ts:183](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L183)*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

___

### x5u

• `Optional` **x5u**: string

*Defined in [src/types.d.ts:193](https://github.com/panva/jose/blob/v3.5.2/src/types.d.ts#L193)*

"x5u" (X.509 URL) Header Parameter.
