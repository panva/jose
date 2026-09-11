# Interface: JWTPayload

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWT Claims Set members; additional members may also be present.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWT Claims Set member.

## Properties

### aud?

• `optional` **aud?**: `string` \| `string`[]

"aud" (Audience) Claim.

#### See

[RFC7519#section-4.1.3](https://www.rfc-editor.org/info/rfc7519/#section-4.1.3)

***

### exp?

• `optional` **exp?**: `number`

"exp" (Expiration Time) Claim, expressed as a NumericDate (seconds since the Unix epoch).

#### See

[RFC7519#section-4.1.4](https://www.rfc-editor.org/info/rfc7519/#section-4.1.4)

***

### iat?

• `optional` **iat?**: `number`

"iat" (Issued At) Claim, expressed as a NumericDate (seconds since the Unix epoch).

#### See

[RFC7519#section-4.1.6](https://www.rfc-editor.org/info/rfc7519/#section-4.1.6)

***

### iss?

• `optional` **iss?**: `string`

"iss" (Issuer) Claim.

#### See

[RFC7519#section-4.1.1](https://www.rfc-editor.org/info/rfc7519/#section-4.1.1)

***

### jti?

• `optional` **jti?**: `string`

"jti" (JWT ID) Claim.

#### See

[RFC7519#section-4.1.7](https://www.rfc-editor.org/info/rfc7519/#section-4.1.7)

***

### nbf?

• `optional` **nbf?**: `number`

"nbf" (Not Before) Claim, expressed as a NumericDate (seconds since the Unix epoch).

#### See

[RFC7519#section-4.1.5](https://www.rfc-editor.org/info/rfc7519/#section-4.1.5)

***

### sub?

• `optional` **sub?**: `string`

"sub" (Subject) Claim.

#### See

[RFC7519#section-4.1.2](https://www.rfc-editor.org/info/rfc7519/#section-4.1.2)
