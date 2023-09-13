# Class: CompactSign

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

The CompactSign class is used to build and sign Compact JWS strings.

**`Example`**

```js
const jws = await new jose.CompactSign(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)

console.log(jws)
```

## Table of contents

### Constructors

- [constructor](jws_compact_sign.CompactSign.md#constructor)

### Methods

- [setProtectedHeader](jws_compact_sign.CompactSign.md#setprotectedheader)
- [sign](jws_compact_sign.CompactSign.md#sign)

## Constructors

### constructor

• **new CompactSign**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | Binary representation of the payload to sign. |

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`CompactSign`](jws_compact_sign.CompactSign.md)

Sets the JWS Protected Header on the Sign object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`CompactJWSHeaderParameters`](../interfaces/types.CompactJWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

[`CompactSign`](jws_compact_sign.CompactSign.md)

___

### sign

▸ **sign**(`key`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>

Signs and resolves the value of the Compact JWS string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to sign the JWS with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWS Sign options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>
