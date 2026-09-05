# Interface: JWK\_AKP\_Public

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Convenience interface for public AKP JSON Web Keys.

## Properties

### alg

• **alg**: `string`

JWK "alg" (Algorithm) Parameter

***

### pub

• **pub**: `string`

AKP JWK "pub" (The Public key) Parameter

***

### ext?

• `optional` **ext?**: `boolean`

Whether the key may be exported.

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

### use?

• `optional` **use?**: `string`

JWK "use" (Public Key Use) Parameter

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
