# Interface: JWEHeaderParameters

[types](../modules/types.md).JWEHeaderParameters

Recognized JWE Header Parameters, any other Header members
may also be present.

## Hierarchy

* [*JoseHeaderParameters*](types.joseheaderparameters.md)

  ↳ **JWEHeaderParameters**

## Indexable

▪ [propName: *string*]: *any*

Any other JWE Header member.

## Table of contents

### Properties

- [alg](types.jweheaderparameters.md#alg)
- [crit](types.jweheaderparameters.md#crit)
- [cty](types.jweheaderparameters.md#cty)
- [enc](types.jweheaderparameters.md#enc)
- [jwk](types.jweheaderparameters.md#jwk)
- [kid](types.jweheaderparameters.md#kid)
- [typ](types.jweheaderparameters.md#typ)
- [x5c](types.jweheaderparameters.md#x5c)
- [x5t](types.jweheaderparameters.md#x5t)
- [x5u](types.jweheaderparameters.md#x5u)
- [zip](types.jweheaderparameters.md#zip)

## Properties

### alg

• `Optional` **alg**: *string*

JWE "alg" (Algorithm) Header Parameter.

Defined in: [types.d.ts:331](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L331)

___

### crit

• `Optional` **crit**: *string*[]

JWE "crit" (Critical) Header Parameter.

Defined in: [types.d.ts:341](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L341)

___

### cty

• `Optional` **cty**: *string*

"cty" (Content Type) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[cty](types.joseheaderparameters.md#cty)

Defined in: [types.d.ts:208](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L208)

___

### enc

• `Optional` **enc**: *string*

JWE "enc" (Encryption Algorithm) Header Parameter.

Defined in: [types.d.ts:336](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L336)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), *kty* \| *crv* \| *x* \| *y* \| *e* \| *n*\>

"jwk" (JSON Web Key) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[jwk](types.joseheaderparameters.md#jwk)

Defined in: [types.d.ts:198](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L198)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[kid](types.joseheaderparameters.md#kid)

Defined in: [types.d.ts:178](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L178)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[typ](types.joseheaderparameters.md#typ)

Defined in: [types.d.ts:203](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L203)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5c](types.joseheaderparameters.md#x5c)

Defined in: [types.d.ts:188](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L188)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5t](types.joseheaderparameters.md#x5t)

Defined in: [types.d.ts:183](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L183)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5u](types.joseheaderparameters.md#x5u)

Defined in: [types.d.ts:193](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L193)

___

### zip

• `Optional` **zip**: *string*

JWE "zip" (Compression Algorithm) Header Parameter.

Defined in: [types.d.ts:346](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L346)
