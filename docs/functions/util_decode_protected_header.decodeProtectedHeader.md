# Function: decodeProtectedHeader

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **decodeProtectedHeader**(`token`): [`ProtectedHeaderParameters`](../types/util_decode_protected_header.ProtectedHeaderParameters.md)

Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/decode/protected_header'`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` \| `object` | JWE/JWS/JWT token in any JOSE serialization. |

#### Returns

[`ProtectedHeaderParameters`](../types/util_decode_protected_header.ProtectedHeaderParameters.md)

**`Example`**

```js
const protectedHeader = jose.decodeProtectedHeader(token)
console.log(protectedHeader)
```
