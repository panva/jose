# Type Alias: SelectedJWSVerifyOptions\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **SelectedJWSVerifyOptions**\<`Algorithm`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`VerifyOptions`](../../../types/interfaces/VerifyOptions.md), `"algorithms"`\> & `object`

JWS verification options with selected algorithms suggested by editors.

## Type Declaration

### algorithms?

• `optional` **algorithms?**: readonly `S`\<`Algorithm`\>[]

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |
