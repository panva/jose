# Class: JWEDecompressionFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWE ciphertext decompression fails.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWE_DECOMPRESSION_FAILED') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWEDecompressionFailed) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWEDecompressionFailed.md#constructor)

### Properties

- [code](util_errors.JWEDecompressionFailed.md#code)
- [message](util_errors.JWEDecompressionFailed.md#message)

### Accessors

- [code](util_errors.JWEDecompressionFailed.md#code-1)

## Constructors

### constructor

• **new JWEDecompressionFailed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWE_DECOMPRESSION_FAILED'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'decompression operation failed'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWE_DECOMPRESSION_FAILED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWE_DECOMPRESSION_FAILED"``
