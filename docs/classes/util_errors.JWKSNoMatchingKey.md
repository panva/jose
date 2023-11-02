# Class: JWKSNoMatchingKey

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when no keys match from a JWKS.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_NO_MATCHING_KEY') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSNoMatchingKey) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWKSNoMatchingKey.md#constructor)

### Properties

- [code](util_errors.JWKSNoMatchingKey.md#code)
- [message](util_errors.JWKSNoMatchingKey.md#message)

### Accessors

- [code](util_errors.JWKSNoMatchingKey.md#code-1)

## Constructors

### constructor

• **new JWKSNoMatchingKey**(`message?`): [`JWKSNoMatchingKey`](util_errors.JWKSNoMatchingKey.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`JWKSNoMatchingKey`](util_errors.JWKSNoMatchingKey.md)

## Properties

### code

• **code**: `string` = `'ERR_JWKS_NO_MATCHING_KEY'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'no applicable key found in the JSON Web Key Set'`

## Accessors

### code

• `get` **code**(): ``"ERR_JWKS_NO_MATCHING_KEY"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWKS_NO_MATCHING_KEY"``
