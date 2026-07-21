# Interface: SDJWTUnprotectedHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JWS Unprotected Header Parameters used by an SD-JWT JSON Serialization.

Members of this header are not integrity protected. The `disclosures` values are linked to the
Issuer-signed payload by their digests, and `kb_jwt` has its own signature, but other members
must not drive security decisions. SD-JWT producers reject `typ` here; use the protected header
for explicit typing.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWS Header member.

## Properties

### disclosures

• **disclosures**: `string`[]

The Disclosures carried with the SD-JWT.

***

### alg?

• `optional` **alg?**: `string`

JWS "alg" (Algorithm) Header Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg)

***

### b64?

• `optional` **b64?**: `boolean`

This JWS Extension Header Parameter modifies the JWS Payload representation and the JWS Signing
Input computation as per [RFC7797](https://www.rfc-editor.org/rfc/rfc7797).

***

### crit?

• `optional` **crit?**: `string`[]

JWS "crit" (Critical) Header Parameter

***

### cty?

• `optional` **cty?**: `string`

"cty" (Content Type) Header Parameter

***

### jku?

• `optional` **jku?**: `string`

"jku" (JWK Set URL) Header Parameter

***

### jwk?

• `optional` **jwk?**: [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)\<[`JWK`](JWK.md), `"x"` \| `"y"` \| `"crv"` \| `"e"` \| `"n"` \| `"pub"` \| `"alg"` \| `"kty"`\>

"jwk" (JSON Web Key) Header Parameter

***

### kb\_jwt?

• `optional` **kb\_jwt?**: `string`

The Key Binding JWT carried with an SD-JWT+KB.

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

"x5c" (X.509 Certificate Chain) Header Parameter

***

### x5t?

• `optional` **x5t?**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter

***

### x5u?

• `optional` **x5u?**: `string`

"x5u" (X.509 URL) Header Parameter
