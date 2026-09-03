# Interface: ComposedGenerateKeyPair()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A key-pair generator restricted to the selected asymmetric algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

▸ **ComposedGenerateKeyPair**(`alg`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GenerateKeyPairResult`](../../../../../key/generate_key_pair/interfaces/GenerateKeyPairResult.md)\>

A key-pair generator restricted to the selected asymmetric algorithms.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `alg` | `Algorithm` |
| `options?` | [`GenerateKeyPairOptions`](../../../../../key/generate_key_pair/interfaces/GenerateKeyPairOptions.md) |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GenerateKeyPairResult`](../../../../../key/generate_key_pair/interfaces/GenerateKeyPairResult.md)\>
