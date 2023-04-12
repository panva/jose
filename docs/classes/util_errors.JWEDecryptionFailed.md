# Class: JWEDecryptionFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWE ciphertext decryption fails.

**`example`** Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWE_DECRYPTION_FAILED') {
  // ...
}
```

**`example`** Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWEDecryptionFailed) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWEDecryptionFailed.md#constructor)

### Properties

- [code](util_errors.JWEDecryptionFailed.md#code)
- [message](util_errors.JWEDecryptionFailed.md#message)

### Accessors

- [code](util_errors.JWEDecryptionFailed.md#code-1)

## Constructors

### constructor

• **new JWEDecryptionFailed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWE_DECRYPTION_FAILED'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'decryption operation failed'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWE_DECRYPTION_FAILED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWE_DECRYPTION_FAILED"``
