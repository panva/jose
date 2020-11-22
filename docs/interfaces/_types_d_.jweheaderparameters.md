# Interface: JWEHeaderParameters

Recognized JWE Header Parameters, any other Header members
may also be present.

## Indexable

▪ [propName: string]: any

Any other JWE Header member.

## Index

### Properties

* [alg](_types_d_.jweheaderparameters.md#alg)
* [crit](_types_d_.jweheaderparameters.md#crit)
* [cty](_types_d_.jweheaderparameters.md#cty)
* [enc](_types_d_.jweheaderparameters.md#enc)
* [jwk](_types_d_.jweheaderparameters.md#jwk)
* [kid](_types_d_.jweheaderparameters.md#kid)
* [typ](_types_d_.jweheaderparameters.md#typ)
* [x5c](_types_d_.jweheaderparameters.md#x5c)
* [x5t](_types_d_.jweheaderparameters.md#x5t)
* [x5u](_types_d_.jweheaderparameters.md#x5u)
* [zip](_types_d_.jweheaderparameters.md#zip)

## Properties

### alg

• `Optional` **alg**: string

*Defined in [src/types.d.ts:293](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L293)*

JWE "alg" (Algorithm) Header Parameter.

___

### crit

• `Optional` **crit**: string[]

*Defined in [src/types.d.ts:303](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L303)*

JWE "crit" (Critical) Header Parameter.

___

### cty

• `Optional` **cty**: string

*Defined in [src/types.d.ts:174](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L174)*

"cty" (Content Type) Header Parameter.

___

### enc

• `Optional` **enc**: string

*Defined in [src/types.d.ts:298](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L298)*

JWE "enc" (Encryption Algorithm) Header Parameter.

___

### jwk

• `Optional` **jwk**: Pick\<[JWK](_types_d_.jwk.md), \"kty\" \| \"crv\" \| \"x\" \| \"y\" \| \"e\" \| \"n\">

*Defined in [src/types.d.ts:164](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L164)*

"jwk" (JSON Web Key) Header Parameter.

___

### kid

• `Optional` **kid**: string

*Defined in [src/types.d.ts:144](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L144)*

"kid" (Key ID) Header Parameter.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:169](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L169)*

"typ" (Type) Header Parameter.

___

### x5c

• `Optional` **x5c**: string[]

*Defined in [src/types.d.ts:154](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L154)*

"x5c" (X.509 Certificate Chain) Header Parameter.

___

### x5t

• `Optional` **x5t**: string

*Defined in [src/types.d.ts:149](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L149)*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

___

### x5u

• `Optional` **x5u**: string

*Defined in [src/types.d.ts:159](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L159)*

"x5u" (X.509 URL) Header Parameter.

___

### zip

• `Optional` **zip**: string

*Defined in [src/types.d.ts:308](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L308)*

JWE "zip" (Compression Algorithm) Header Parameter.
