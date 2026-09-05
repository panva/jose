# Interface: JWTPayload

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWT Claims Set members; additional members may also be present.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWT Claim Set member.

## Properties

### aud?

• `optional` **aud?**: `string` \| `string`[]

JWT Audience

#### See

[RFC7519#section-4.1.3](https://www.rfc-editor.org/info/rfc7519/#section-4.1.3)

***

### exp?

• `optional` **exp?**: `number`

Expiration Unix timestamp in seconds.

#### See

[RFC7519#section-4.1.4](https://www.rfc-editor.org/info/rfc7519/#section-4.1.4)

***

### iat?

• `optional` **iat?**: `number`

Issued-at Unix timestamp in seconds.

#### See

[RFC7519#section-4.1.6](https://www.rfc-editor.org/info/rfc7519/#section-4.1.6)

***

### iss?

• `optional` **iss?**: `string`

JWT Issuer

#### See

[RFC7519#section-4.1.1](https://www.rfc-editor.org/info/rfc7519/#section-4.1.1)

***

### jti?

• `optional` **jti?**: `string`

JWT ID

#### See

[RFC7519#section-4.1.7](https://www.rfc-editor.org/info/rfc7519/#section-4.1.7)

***

### nbf?

• `optional` **nbf?**: `number`

Not valid before this Unix timestamp in seconds.

#### See

[RFC7519#section-4.1.5](https://www.rfc-editor.org/info/rfc7519/#section-4.1.5)

***

### sub?

• `optional` **sub?**: `string`

JWT Subject

#### See

[RFC7519#section-4.1.2](https://www.rfc-editor.org/info/rfc7519/#section-4.1.2)
