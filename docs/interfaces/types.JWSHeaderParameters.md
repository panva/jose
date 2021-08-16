# Interface: JWSHeaderParameters

[types](../modules/types.md).JWSHeaderParameters

Recognized JWS Header Parameters, any other Header Members
may also be present.

## Hierarchy

- [`JoseHeaderParameters`](types.JoseHeaderParameters.md)

  ↳ **`JWSHeaderParameters`**

## Indexable

▪ [propName: `string`]: `unknown`

Any other JWS Header member.

## Table of contents

### Properties

- [alg](types.JWSHeaderParameters.md#alg)
- [b64](types.JWSHeaderParameters.md#b64)
- [crit](types.JWSHeaderParameters.md#crit)
- [cty](types.JWSHeaderParameters.md#cty)
- [jku](types.JWSHeaderParameters.md#jku)
- [jwk](types.JWSHeaderParameters.md#jwk)
- [kid](types.JWSHeaderParameters.md#kid)
- [typ](types.JWSHeaderParameters.md#typ)
- [x5c](types.JWSHeaderParameters.md#x5c)
- [x5t](types.JWSHeaderParameters.md#x5t)
- [x5u](types.JWSHeaderParameters.md#x5u)

## Properties

### alg

• `Optional` **alg**: `string`

JWS "alg" (Algorithm) Header Parameter.

#### Defined in

[types.d.ts:282](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L282)

___

### b64

• `Optional` **b64**: `boolean`

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://tools.ietf.org/html/rfc7797).

#### Defined in

[types.d.ts:289](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L289)

___

### crit

• `Optional` **crit**: `string`[]

JWS "crit" (Critical) Header Parameter.

#### Defined in

[types.d.ts:294](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L294)

___

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[cty](types.JoseHeaderParameters.md#cty)

#### Defined in

[types.d.ts:271](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L271)

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[jku](types.JoseHeaderParameters.md#jku)

#### Defined in

[types.d.ts:256](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L256)

___

### jwk

• `Optional` **jwk**: `Pick`<[`JWK`](types.JWK.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[jwk](types.JoseHeaderParameters.md#jwk)

#### Defined in

[types.d.ts:261](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L261)

___

### kid

• `Optional` **kid**: `string`

"kid" (Key ID) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[kid](types.JoseHeaderParameters.md#kid)

#### Defined in

[types.d.ts:236](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L236)

___

### typ

• `Optional` **typ**: `string`

"typ" (Type) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[typ](types.JoseHeaderParameters.md#typ)

#### Defined in

[types.d.ts:266](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L266)

___

### x5c

• `Optional` **x5c**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[x5c](types.JoseHeaderParameters.md#x5c)

#### Defined in

[types.d.ts:246](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L246)

___

### x5t

• `Optional` **x5t**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[x5t](types.JoseHeaderParameters.md#x5t)

#### Defined in

[types.d.ts:241](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L241)

___

### x5u

• `Optional` **x5u**: `string`

"x5u" (X.509 URL) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[x5u](types.JoseHeaderParameters.md#x5u)

#### Defined in

[types.d.ts:251](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L251)
