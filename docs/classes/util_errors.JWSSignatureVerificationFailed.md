# Class: JWSSignatureVerificationFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when JWS signature verification fails.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
  // ...
}
```

## Table of contents

### Constructors

- [constructor](util_errors.JWSSignatureVerificationFailed.md#constructor)

### Properties

- [code](util_errors.JWSSignatureVerificationFailed.md#code)
- [message](util_errors.JWSSignatureVerificationFailed.md#message)

### Accessors

- [code](util_errors.JWSSignatureVerificationFailed.md#code-1)

## Constructors

### constructor

• **new JWSSignatureVerificationFailed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'signature verification failed'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWS_SIGNATURE_VERIFICATION_FAILED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWS_SIGNATURE_VERIFICATION_FAILED"``
