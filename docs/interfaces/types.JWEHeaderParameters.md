# Interface: JWEHeaderParameters

[types](../modules/types.md).JWEHeaderParameters

Recognized JWE Header Parameters, any other Header members
may also be present.

## Hierarchy

- [`JoseHeaderParameters`](types.JoseHeaderParameters.md)

  ↳ **`JWEHeaderParameters`**

## Indexable

▪ [propName: `string`]: `unknown`

Any other JWE Header member.

## Table of contents

### Properties

- [alg](types.JWEHeaderParameters.md#alg)
- [crit](types.JWEHeaderParameters.md#crit)
- [cty](types.JWEHeaderParameters.md#cty)
- [enc](types.JWEHeaderParameters.md#enc)
- [jku](types.JWEHeaderParameters.md#jku)
- [jwk](types.JWEHeaderParameters.md#jwk)
- [kid](types.JWEHeaderParameters.md#kid)
- [typ](types.JWEHeaderParameters.md#typ)
- [x5c](types.JWEHeaderParameters.md#x5c)
- [x5t](types.JWEHeaderParameters.md#x5t)
- [x5u](types.JWEHeaderParameters.md#x5u)
- [zip](types.JWEHeaderParameters.md#zip)

## Properties

### alg

• `Optional` **alg**: `string`

JWE "alg" (Algorithm) Header Parameter.

#### Defined in

[types.d.ts:393](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L393)

___

### crit

• `Optional` **crit**: `string`[]

JWE "crit" (Critical) Header Parameter.

#### Defined in

[types.d.ts:403](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L403)

___

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[cty](types.JoseHeaderParameters.md#cty)

#### Defined in

[types.d.ts:270](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L270)

___

### enc

• `Optional` **enc**: `string`

JWE "enc" (Encryption Algorithm) Header Parameter.

#### Defined in

[types.d.ts:398](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L398)

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[jku](types.JoseHeaderParameters.md#jku)

#### Defined in

[types.d.ts:255](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L255)

___

### jwk

• `Optional` **jwk**: `Pick`<[`JWK`](types.JWK.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[jwk](types.JoseHeaderParameters.md#jwk)

#### Defined in

[types.d.ts:260](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L260)

___

### kid

• `Optional` **kid**: `string`

"kid" (Key ID) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[kid](types.JoseHeaderParameters.md#kid)

#### Defined in

[types.d.ts:235](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L235)

___

### typ

• `Optional` **typ**: `string`

"typ" (Type) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[typ](types.JoseHeaderParameters.md#typ)

#### Defined in

[types.d.ts:265](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L265)

___

### x5c

• `Optional` **x5c**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[x5c](types.JoseHeaderParameters.md#x5c)

#### Defined in

[types.d.ts:245](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L245)

___

### x5t

• `Optional` **x5t**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[x5t](types.JoseHeaderParameters.md#x5t)

#### Defined in

[types.d.ts:240](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L240)

___

### x5u

• `Optional` **x5u**: `string`

"x5u" (X.509 URL) Header Parameter.

#### Inherited from

[JoseHeaderParameters](types.JoseHeaderParameters.md).[x5u](types.JoseHeaderParameters.md#x5u)

#### Defined in

[types.d.ts:250](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L250)

___

### zip

• `Optional` **zip**: `string`

JWE "zip" (Compression Algorithm) Header Parameter.

#### Defined in

[types.d.ts:408](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L408)
