# Class: JWKSMultipleMatchingKeys

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when multiple keys match from a JWKS.

**`example`** Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
  // ...
}
```

**`example`** Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSMultipleMatchingKeys) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWKSMultipleMatchingKeys.md#constructor)

### Properties

- [code](util_errors.JWKSMultipleMatchingKeys.md#code)
- [message](util_errors.JWKSMultipleMatchingKeys.md#message)

### Accessors

- [code](util_errors.JWKSMultipleMatchingKeys.md#code-1)

## Constructors

### constructor

• **new JWKSMultipleMatchingKeys**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWKS_MULTIPLE_MATCHING_KEYS'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'multiple matching keys found in the JSON Web Key Set'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWKS_MULTIPLE_MATCHING_KEYS"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWKS_MULTIPLE_MATCHING_KEYS"``
