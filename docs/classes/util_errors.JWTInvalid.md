# Class: JWTInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWT is invalid.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWT_INVALID') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWTInvalid) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWTInvalid.md#constructor)

### Properties

- [code](util_errors.JWTInvalid.md#code)

### Accessors

- [code](util_errors.JWTInvalid.md#code-1)

## Constructors

### constructor

• **new JWTInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWT_INVALID'`

A unique error code for the particular error subclass.

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWT_INVALID"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWT_INVALID"``
