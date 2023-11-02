# Class: JWEInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWE is invalid.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWE_INVALID') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWEInvalid) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWEInvalid.md#constructor)

### Properties

- [code](util_errors.JWEInvalid.md#code)

### Accessors

- [code](util_errors.JWEInvalid.md#code-1)

## Constructors

### constructor

• **new JWEInvalid**(`message?`): [`JWEInvalid`](util_errors.JWEInvalid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`JWEInvalid`](util_errors.JWEInvalid.md)

## Properties

### code

• **code**: `string` = `'ERR_JWE_INVALID'`

A unique error code for the particular error subclass.

## Accessors

### code

• `get` **code**(): ``"ERR_JWE_INVALID"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWE_INVALID"``
