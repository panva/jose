# Interface: JWK

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JSON Web Key ([JWK](https://www.rfc-editor.org/rfc/rfc7517)). "RSA", "EC", "OKP", "AKP", and
"oct" key types are supported.

## See

 - [JWK\_AKP\_Public](JWK_AKP_Public.md)
 - [JWK\_AKP\_Private](JWK_AKP_Private.md)
 - [JWK\_OKP\_Public](JWK_OKP_Public.md)
 - [JWK\_OKP\_Private](JWK_OKP_Private.md)
 - [JWK\_EC\_Public](JWK_EC_Public.md)
 - [JWK\_EC\_Private](JWK_EC_Private.md)
 - [JWK\_RSA\_Public](JWK_RSA_Public.md)
 - [JWK\_RSA\_Private](JWK_RSA_Private.md)
 - [JWK\_oct](JWK_oct.md)

## Properties

### alg?

• `optional` **alg?**: `string`

JWK "alg" (Algorithm) Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210)

***

### crv?

• `optional` **crv?**: `string`

- EC JWK "crv" (Curve) Parameter
- OKP JWK "crv" (The Subtype of Key Pair) Parameter

***

### d?

• `optional` **d?**: `string`

- Private RSA JWK "d" (Private Exponent) Parameter
- Private EC JWK "d" (ECC Private Key) Parameter
- Private OKP JWK "d" (The Private Key) Parameter

***

### dp?

• `optional` **dp?**: `string`

Private RSA JWK "dp" (First Factor CRT Exponent) Parameter

***

### dq?

• `optional` **dq?**: `string`

Private RSA JWK "dq" (Second Factor CRT Exponent) Parameter

***

### e?

• `optional` **e?**: `string`

RSA JWK "e" (Exponent) Parameter

***

### ext?

• `optional` **ext?**: `boolean`

JWK "ext" (Extractable) Parameter

***

### k?

• `optional` **k?**: `string`

Oct JWK "k" (Key Value) Parameter

***

### key\_ops?

• `optional` **key\_ops?**: `string`[]

JWK "key_ops" (Key Operations) Parameter

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

RSA JWK "n" (Modulus) Parameter

***

### p?

• `optional` **p?**: `string`

Private RSA JWK "p" (First Prime Factor) Parameter

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

Private RSA JWK "q" (Second Prime Factor) Parameter

***

### qi?

• `optional` **qi?**: `string`

Private RSA JWK "qi" (First CRT Coefficient) Parameter

***

### use?

• `optional` **use?**: `string`

JWK "use" (Public Key Use) Parameter

***

### x?

• `optional` **x?**: `string`

- EC JWK "x" (X Coordinate) Parameter
- OKP JWK "x" (The public key) Parameter

***

### x5c?

• `optional` **x5c?**: `string`[]

JWK "x5c" (X.509 Certificate Chain) Parameter

***

### x5t?

• `optional` **x5t?**: `string`

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter

***

### x5t#S256?

• `optional` **x5t#S256?**: `string`

JWK "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter

***

### x5u?

• `optional` **x5u?**: `string`

JWK "x5u" (X.509 URL) Parameter

***

### y?

• `optional` **y?**: `string`

EC JWK "y" (Y Coordinate) Parameter
