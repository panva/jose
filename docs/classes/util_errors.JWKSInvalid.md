# Class: JWKSInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWKS is invalid.

**`example`** Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_INVALID') {
  // ...
}
```

**`example`** Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSInvalid) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWKSInvalid.md#constructor)

### Properties

- [code](util_errors.JWKSInvalid.md#code)

### Accessors

- [code](util_errors.JWKSInvalid.md#code-1)

## Constructors

### constructor

• **new JWKSInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWKS_INVALID'`

A unique error code for the particular error subclass.

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWKS_INVALID"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWKS_INVALID"``
