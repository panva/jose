# Interface: GetKeyFunction()\<IProtectedHeader, IToken, KeyTypes\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Dynamic key resolver for consuming operations.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `IProtectedHeader` | - | Type definition of the JWE or JWS Protected Header. |
| `IToken` | - | Type definition of the consumed JWE or JWS token. |
| `KeyTypes` *extends* [`KeyInput`](../type-aliases/KeyInput.md) | [`KeyInput`](../type-aliases/KeyInput.md) | Type definition of the keys the function may resolve. Narrowing this is what lets [ResolvedKey.key](ResolvedKey.md#key) be inferred at the call site. |

▸ **GetKeyFunction**(`protectedHeader`, `token`): `KeyTypes` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`KeyTypes`\>

Resolves a key for an unverified token. Throw if no suitable key can be resolved.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | `IProtectedHeader` | JWE or JWS Protected Header. |
| `token` | `IToken` | The consumed JWE or JWS token; none of its components have been verified. |

## Returns

`KeyTypes` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`KeyTypes`\>
