# Type Alias: JWK

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JSON Web Key ([JWK](https://www.rfc-editor.org/info/rfc7517/)). "RSA", "EC", "OKP", "AKP",
and "oct" key types are supported.

> [!NOTE]\
> This is declared as a type alias rather than an interface so that it satisfies the implicit index
> signature of the `JsonWebKey` types shipped by `@types/node` and `lib.dom`. It spells out the
> [JWKParameters](JWKParameters.md) members rather than intersecting them so that every JWK member is documented
> in one place.

## See

 - [JWK\_AKP\_Public](../interfaces/JWK_AKP_Public.md)
 - [JWK\_AKP\_Private](../interfaces/JWK_AKP_Private.md)
 - [JWK\_OKP\_Public](../interfaces/JWK_OKP_Public.md)
 - [JWK\_OKP\_Private](../interfaces/JWK_OKP_Private.md)
 - [JWK\_EC\_Public](../interfaces/JWK_EC_Public.md)
 - [JWK\_EC\_Private](../interfaces/JWK_EC_Private.md)
 - [JWK\_RSA\_Public](../interfaces/JWK_RSA_Public.md)
 - [JWK\_RSA\_Private](../interfaces/JWK_RSA_Private.md)
 - [JWK\_oct](../interfaces/JWK_oct.md)
 - [AnyJWK](AnyJWK.md) for a variant that can be narrowed on the "kty" (Key Type) Parameter.

## Properties

### alg?

• `optional` **alg?**: `string`

JWK "alg" (Algorithm) Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210)

***

### crv?

• `optional` **crv?**: `string`

EC curve or OKP key pair subtype.

***

### d?

• `optional` **d?**: `string`

Private RSA exponent, EC key, or OKP key.

***

### dp?

• `optional` **dp?**: `string`

RSA first factor CRT exponent.

***

### dq?

• `optional` **dq?**: `string`

RSA second factor CRT exponent.

***

### e?

• `optional` **e?**: `string`

RSA public exponent.

***

### ext?

• `optional` **ext?**: `boolean`

Whether the key may be exported.

***

### k?

• `optional` **k?**: `string`

Symmetric key value.

***

### key\_ops?

• `optional` **key\_ops?**: `string`[]

Permitted key operations.

***

### kid?

• `optional` **kid?**: `string`

JWK "kid" (Key ID) Parameter

***

### kty?

• `optional` **kty?**: `string`

JWK "kty" (Key Type) Parameter

***

### n?

• `optional` **n?**: `string`

RSA modulus.

***

### oth?

• `optional` **oth?**: `object`[]

Additional RSA prime factors.

#### d?

• `optional` **d?**: `string`

Factor CRT exponent.

#### r?

• `optional` **r?**: `string`

Prime factor.

#### t?

• `optional` **t?**: `string`

Factor CRT coefficient.

***

### p?

• `optional` **p?**: `string`

RSA first prime factor.

***

### priv?

• `optional` **priv?**: `string`

AKP JWK "priv" (Private key) Parameter

***

### pub?

• `optional` **pub?**: `string`

AKP JWK "pub" (Public Key) Parameter

***

### q?

• `optional` **q?**: `string`

RSA second prime factor.

***

### qi?

• `optional` **qi?**: `string`

RSA first CRT coefficient.

***

### use?

• `optional` **use?**: `string`

JWK "use" (Public Key Use) Parameter

***

### x?

• `optional` **x?**: `string`

EC public key X coordinate or OKP public key.

***

### x5c?

• `optional` **x5c?**: `string`[]

X.509 certificate chain.

***

### x5t?

• `optional` **x5t?**: `string`

X.509 certificate SHA-1 thumbprint.

***

### x5t#S256?

• `optional` **x5t#S256?**: `string`

X.509 certificate SHA-256 thumbprint.

***

### x5u?

• `optional` **x5u?**: `string`

X.509 certificate URL.

***

### y?

• `optional` **y?**: `string`

EC public key Y coordinate.
