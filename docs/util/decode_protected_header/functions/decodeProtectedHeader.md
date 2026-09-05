# Function: decodeProtectedHeader()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **decodeProtectedHeader**(`token`): [`ProtectedHeaderParameters`](../type-aliases/ProtectedHeaderParameters.md)

Decodes the Protected Header of a JWE, JWS, or JWT without authenticating the token.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/decode/protected_header'`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | `string` \| `object` | Compact token or JSON serialization object with a `protected` member. |

## Returns

[`ProtectedHeaderParameters`](../type-aliases/ProtectedHeaderParameters.md)

The parsed Protected Header.

## Example

```js
const protectedHeader = jose.decodeProtectedHeader(token)
console.log(protectedHeader)
```
