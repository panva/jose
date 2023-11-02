# Class: JWSInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWS is invalid.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWS_INVALID') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWSInvalid) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWSInvalid.md#constructor)

### Properties

- [code](util_errors.JWSInvalid.md#code)

### Accessors

- [code](util_errors.JWSInvalid.md#code-1)

## Constructors

### constructor

• **new JWSInvalid**(`message?`): [`JWSInvalid`](util_errors.JWSInvalid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`JWSInvalid`](util_errors.JWSInvalid.md)

## Properties

### code

• **code**: `string` = `'ERR_JWS_INVALID'`

A unique error code for the particular error subclass.

## Accessors

### code

• `get` **code**(): ``"ERR_JWS_INVALID"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWS_INVALID"``
