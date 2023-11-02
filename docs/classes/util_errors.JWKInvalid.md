# Class: JWKInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWK is invalid.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWK_INVALID') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKInvalid) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWKInvalid.md#constructor)

### Properties

- [code](util_errors.JWKInvalid.md#code)

### Accessors

- [code](util_errors.JWKInvalid.md#code-1)

## Constructors

### constructor

• **new JWKInvalid**(`message?`): [`JWKInvalid`](util_errors.JWKInvalid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`JWKInvalid`](util_errors.JWKInvalid.md)

## Properties

### code

• **code**: `string` = `'ERR_JWK_INVALID'`

A unique error code for the particular error subclass.

## Accessors

### code

• `get` **code**(): ``"ERR_JWK_INVALID"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWK_INVALID"``
