# Interface: InflateFunction

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Inflate Raw implementation, e.g. promisified
[zlib.inflateRaw](https://nodejs.org/api/zlib.html#zlibinflaterawbuffer-options-callback).

**`deprecated`** Compression of data SHOULD NOT be done before encryption, because such compressed
  data often reveals information about the plaintext.

**`see`** [Avoid Compression of Encryption Inputs](https://www.rfc-editor.org/rfc/rfc8725#name-avoid-compression-of-encryp)

## Callable

### InflateFunction

▸ **InflateFunction**(`input`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )\>
