# Type Alias: SelectedFlattenedJWSInput\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **SelectedFlattenedJWSInput**\<`Algorithm`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedJWSInput`](../../../../types/interfaces/FlattenedJWSInput.md), `"header"`\> & `object`

Flattened JWS input with selected `alg` identifiers suggested by editors.

## Type Declaration

### header?

• `optional` **header?**: [`SelectedJWSHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |
