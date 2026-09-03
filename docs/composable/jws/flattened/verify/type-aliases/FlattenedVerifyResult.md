# Type Alias: FlattenedVerifyResult\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **FlattenedVerifyResult**\<`Algorithm`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedVerifyResult`](../../../../../types/interfaces/FlattenedVerifyResult.md), `"protectedHeader"` \| `"unprotectedHeader"`\>

Flattened JWS verification result with header suggestions from the selected algorithms.

## Type Declaration

### protectedHeader?

• `optional` **protectedHeader?**: [`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>

### unprotectedHeader?

• `optional` **unprotectedHeader?**: [`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |
