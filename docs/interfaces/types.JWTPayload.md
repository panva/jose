# Interface: JWTPayload

[💗 Help the project](https://github.com/sponsors/panva)

Recognized JWT Claims Set members, any other members may also be present.

## Table of contents

### Properties

- [aud](types.JWTPayload.md#aud)
- [exp](types.JWTPayload.md#exp)
- [iat](types.JWTPayload.md#iat)
- [iss](types.JWTPayload.md#iss)
- [jti](types.JWTPayload.md#jti)
- [nbf](types.JWTPayload.md#nbf)
- [sub](types.JWTPayload.md#sub)

## Properties

### aud

• `Optional` **aud**: `string` \| `string`[]

JWT Audience [RFC7519#section-4.1.3](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3).

___

### exp

• `Optional` **exp**: `number`

JWT Expiration Time

**`see`** [RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)

___

### iat

• `Optional` **iat**: `number`

JWT Issued At

**`see`** [RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)

___

### iss

• `Optional` **iss**: `string`

JWT Issuer

**`see`** [RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)

___

### jti

• `Optional` **jti**: `string`

JWT ID

**`see`** [RFC7519#section-4.1.7](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)

___

### nbf

• `Optional` **nbf**: `number`

JWT Not Before

**`see`** [RFC7519#section-4.1.5](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)

___

### sub

• `Optional` **sub**: `string`

JWT Subject

**`see`** [RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)
