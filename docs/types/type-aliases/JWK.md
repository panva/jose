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

JWK "crv" Parameter: Curve for EC keys or Subtype of Key Pair for OKP keys.

***

### d?

• `optional` **d?**: `string`

Private key material: Base64urlUInt for RSA (RFC 7518, Section 6.3.2.1), base64url-encoded
octets for EC (Section 6.2.2.1) or OKP (RFC 8037, Section 2).

***

### dp?

• `optional` **dp?**: `string`

RSA first factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### dq?

• `optional` **dq?**: `string`

RSA second factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### e?

• `optional` **e?**: `string`

RSA public exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### ext?

• `optional` **ext?**: `boolean`

Web Crypto "ext" (Extractable) member; whether the key may be exported.

***

### k?

• `optional` **k?**: `string`

JWK "k" (Key Value): base64url-encoded key octets (RFC 7518, Section 6.4.1).

***

### key\_ops?

• `optional` **key\_ops?**: `string`[]

JWK "key_ops" (Key Operations) Parameter (RFC 7517, Section 4.3).

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

RSA modulus, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### oth?

• `optional` **oth?**: `object`[]

Additional RSA prime factors.

#### d?

• `optional` **d?**: `string`

Factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3).

#### r?

• `optional` **r?**: `string`

Prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3).

#### t?

• `optional` **t?**: `string`

Factor CRT coefficient, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### p?

• `optional` **p?**: `string`

RSA first prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### priv?

• `optional` **priv?**: `string`

AKP JWK "priv" (Private Key): base64url-encoded private key; ML-DSA uses a 32-octet seed (RFC
9964, Sections 3-4)

***

### pub?

• `optional` **pub?**: `string`

AKP JWK "pub" (Public Key): base64url-encoded public key (RFC 9964, Section 3)

***

### q?

• `optional` **q?**: `string`

RSA second prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### qi?

• `optional` **qi?**: `string`

RSA first CRT coefficient, encoded as Base64urlUInt (RFC 7518, Section 6.3).

***

### use?

• `optional` **use?**: `string`

JWK "use" (Public Key Use) Parameter

***

### x?

• `optional` **x?**: `string`

Base64url-encoded EC x-coordinate (RFC 7518, Section 6.2.1.2) or OKP public key (RFC 8037,
Section 2).

***

### x5c?

• `optional` **x5c?**: `string`[]

"x5c" (X.509 Certificate Chain): base64-encoded DER certificates (RFC 7517, Section 4.7; RFC
7515, Section 4.1.6).

***

### x5t?

• `optional` **x5t?**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint): base64url-encoded digest of the DER certificate.

***

### x5t#S256?

• `optional` **x5t#S256?**: `string`

"x5t#S256" (X.509 Certificate SHA-256 Thumbprint): base64url-encoded digest of the DER
certificate.

***

### x5u?

• `optional` **x5u?**: `string`

JWK "x5u" (X.509 URL) Parameter: URL of a PEM-encoded certificate or certificate chain.

***

### y?

• `optional` **y?**: `string`

Base64url-encoded EC y-coordinate (RFC 7518, Section 6.2.1.3).
