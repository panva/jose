# Class: JOSEAlgNotAllowed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JOSE Algorithm is not allowed per developer preference.

**`example`** Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JOSE_ALG_NOT_ALLOWED') {
  // ...
}
```

**`example`** Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JOSEAlgNotAllowed) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JOSEAlgNotAllowed.md#constructor)

### Properties

- [code](util_errors.JOSEAlgNotAllowed.md#code)

### Accessors

- [code](util_errors.JOSEAlgNotAllowed.md#code-1)

## Constructors

### constructor

• **new JOSEAlgNotAllowed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JOSE_ALG_NOT_ALLOWED'`

A unique error code for the particular error subclass.

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JOSE_ALG_NOT_ALLOWED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JOSE_ALG_NOT_ALLOWED"``
