# Function: decodeProtectedHeader

▸ **decodeProtectedHeader**(`token`): [`ProtectedHeaderParameters`](../types/util_decode_protected_header.ProtectedHeaderParameters.md)

Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.

**`example`** Usage
```js
const protectedHeader = jose.decodeProtectedHeader(token)
console.log(protectedHeader)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` \| `object` | JWE/JWS/JWT token in any JOSE serialization. |

#### Returns

[`ProtectedHeaderParameters`](../types/util_decode_protected_header.ProtectedHeaderParameters.md)
