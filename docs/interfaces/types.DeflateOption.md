# Interface: DeflateOption

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

JWE Deflate option.

## Table of contents

### Properties

- [deflateRaw](types.DeflateOption.md#deflateraw)

## Properties

### deflateRaw

• `Optional` **deflateRaw**: [`DeflateFunction`](types.DeflateFunction.md)

In a browser runtime you have to provide an implementation for Deflate Raw when you will be
producing JWEs with compressed plaintext.
