# Interface: JoseHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Header Parameters common to JWE and JWS.

## Properties

### cty?

• `optional` **cty?**: `string`

"cty" (Content Type) Header Parameter (RFC 7515, Section 4.1.10).

***

### jku?

• `optional` **jku?**: `string`

"jku" (JWK Set URL) Header Parameter (RFC 7515, Section 4.1.2).

***

### jwk?

• `optional` **jwk?**: [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWK`](../type-aliases/JWK.md), `"d"` \| `"p"` \| `"q"` \| `"k"` \| `"dp"` \| `"dq"` \| `"qi"` \| `"priv"` \| `"oth"`\>

"jwk" (JSON Web Key) Header Parameter: public JWK only; private and symmetric key parameters
are not permitted.

***

### kid?

• `optional` **kid?**: `string`

"kid" (Key ID) Header Parameter

***

### typ?

• `optional` **typ?**: `string`

"typ" (Type) Header Parameter

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

### x5u?

• `optional` **x5u?**: `string`

"x5u" (X.509 URL) Header Parameter: URL of a PEM-encoded certificate or certificate chain.
