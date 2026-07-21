# Interface: SDJWTKeyBindingPayload

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Claims required in a valid RFC 9901 Key Binding JWT.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWT Claim Set member.

## Properties

### aud

• **aud**: `string`

JWT Audience

#### See

[RFC7519#section-4.1.3](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3)

***

### iat

• **iat**: `number`

JWT Issued At

#### See

[RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)

***

### nonce

• **nonce**: `string`

***

### sd\_hash

• **sd\_hash**: `string`

***

### exp?

• `optional` **exp?**: `number`

JWT Expiration Time

#### See

[RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)

***

### iss?

• `optional` **iss?**: `string`

JWT Issuer

#### See

[RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)

***

### jti?

• `optional` **jti?**: `string`

JWT ID

#### See

[RFC7519#section-4.1.7](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)

***

### nbf?

• `optional` **nbf?**: `number`

JWT Not Before

#### See

[RFC7519#section-4.1.5](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)

***

### sub?

• `optional` **sub?**: `string`

JWT Subject

#### See

[RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)
