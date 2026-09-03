# Interface: ComposedGenerateSecret()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A secret generator restricted to the selected symmetric algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

▸ **ComposedGenerateSecret**\<`Selected`\>(`alg`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneratedSecret`](../../../../../key/generate_secret/type-aliases/GeneratedSecret.md)\<`Selected`\>\>

A secret generator restricted to the selected symmetric algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Selected` *extends* `string` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `alg` | `Selected` |
| `options?` | [`GenerateSecretOptions`](../../../../../key/generate_secret/interfaces/GenerateSecretOptions.md) |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneratedSecret`](../../../../../key/generate_secret/type-aliases/GeneratedSecret.md)\<`Selected`\>\>
