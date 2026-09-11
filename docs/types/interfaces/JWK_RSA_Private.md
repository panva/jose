# Interface: JWK\_RSA\_Private

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Convenience interface for private RSA JSON Web Keys.

## Properties

### d

• **d**: `string`

Private exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3.2).

***

### dp

• **dp**: `string`

First factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3.2).

***

### dq

• **dq**: `string`

Second factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3.2).

***

### e

• **e**: `string`

Public exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3.1).

***

### n

• **n**: `string`

Modulus, encoded as Base64urlUInt (RFC 7518, Section 6.3.1).

***

### p

• **p**: `string`

First prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3.2).

***

### q

• **q**: `string`

Second prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3.2).

***

### qi

• **qi**: `string`

First CRT coefficient, encoded as Base64urlUInt (RFC 7518, Section 6.3.2).

***

### alg?

• `optional` **alg?**: `string`

JWK "alg" (Algorithm) Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210)

***

### ext?

• `optional` **ext?**: `boolean`

Web Crypto "ext" (Extractable) member; whether the key may be exported.

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

### use?

• `optional` **use?**: `string`

JWK "use" (Public Key Use) Parameter

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
