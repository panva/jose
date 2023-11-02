# Class: JOSEError

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

A generic Error that all other JOSE specific Error subclasses extend.

**`Example`**

Checking thrown error is a JOSE one

```js
if (err instanceof jose.errors.JOSEError) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JOSEError.md#constructor)

### Properties

- [code](util_errors.JOSEError.md#code)

### Accessors

- [code](util_errors.JOSEError.md#code-1)

## Constructors

### constructor

• **new JOSEError**(`message?`): [`JOSEError`](util_errors.JOSEError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`JOSEError`](util_errors.JOSEError.md)

## Properties

### code

• **code**: `string` = `'ERR_JOSE_GENERIC'`

A unique error code for the particular error subclass.

## Accessors

### code

• `get` **code**(): `string`

A unique error code for the particular error subclass.

#### Returns

`string`
