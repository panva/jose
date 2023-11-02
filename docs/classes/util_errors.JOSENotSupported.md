# Class: JOSENotSupported

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a particular feature or algorithm is not supported by this
implementation or JOSE in general.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JOSE_NOT_SUPPORTED') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JOSENotSupported) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JOSENotSupported.md#constructor)

### Properties

- [code](util_errors.JOSENotSupported.md#code)

### Accessors

- [code](util_errors.JOSENotSupported.md#code-1)

## Constructors

### constructor

• **new JOSENotSupported**(`message?`): [`JOSENotSupported`](util_errors.JOSENotSupported.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`JOSENotSupported`](util_errors.JOSENotSupported.md)

## Properties

### code

• **code**: `string` = `'ERR_JOSE_NOT_SUPPORTED'`

A unique error code for the particular error subclass.

## Accessors

### code

• `get` **code**(): ``"ERR_JOSE_NOT_SUPPORTED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JOSE_NOT_SUPPORTED"``
