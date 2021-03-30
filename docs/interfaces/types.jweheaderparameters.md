# Interface: JWEHeaderParameters

[types](../modules/types.md).JWEHeaderParameters

Recognized JWE Header Parameters, any other Header members
may also be present.

## Hierarchy

* [*JoseHeaderParameters*](types.joseheaderparameters.md)

  ↳ **JWEHeaderParameters**

## Indexable

▪ [propName: *string*]: *unknown*

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

Defined in: [types.d.ts:337](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L337)

___

### crit

• `Optional` **crit**: *string*[]

JWE "crit" (Critical) Header Parameter.

Defined in: [types.d.ts:347](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L347)

___

### cty

• `Optional` **cty**: *string*

"cty" (Content Type) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[cty](types.joseheaderparameters.md#cty)

Defined in: [types.d.ts:214](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L214)

___

### enc

• `Optional` **enc**: *string*

JWE "enc" (Encryption Algorithm) Header Parameter.

Defined in: [types.d.ts:342](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L342)

___

### jwk

• `Optional` **jwk**: *Pick*<[*JWK*](types.jwk.md), *kty* \| *crv* \| *x* \| *y* \| *e* \| *n*\>

"jwk" (JSON Web Key) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[jwk](types.joseheaderparameters.md#jwk)

Defined in: [types.d.ts:204](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L204)

___

### kid

• `Optional` **kid**: *string*

"kid" (Key ID) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[kid](types.joseheaderparameters.md#kid)

Defined in: [types.d.ts:184](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L184)

___

### typ

• `Optional` **typ**: *string*

"typ" (Type) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[typ](types.joseheaderparameters.md#typ)

Defined in: [types.d.ts:209](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L209)

___

### x5c

• `Optional` **x5c**: *string*[]

"x5c" (X.509 Certificate Chain) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5c](types.joseheaderparameters.md#x5c)

Defined in: [types.d.ts:194](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L194)

___

### x5t

• `Optional` **x5t**: *string*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5t](types.joseheaderparameters.md#x5t)

Defined in: [types.d.ts:189](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L189)

___

### x5u

• `Optional` **x5u**: *string*

"x5u" (X.509 URL) Header Parameter.

Inherited from: [JoseHeaderParameters](types.joseheaderparameters.md).[x5u](types.joseheaderparameters.md#x5u)

Defined in: [types.d.ts:199](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L199)

___

### zip

• `Optional` **zip**: *string*

JWE "zip" (Compression Algorithm) Header Parameter.

Defined in: [types.d.ts:352](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L352)
