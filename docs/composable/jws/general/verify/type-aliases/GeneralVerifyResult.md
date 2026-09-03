# Type Alias: GeneralVerifyResult\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **GeneralVerifyResult**\<`Algorithm`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralVerifyResult`](../../../../../types/interfaces/GeneralVerifyResult.md), `"protectedHeader"` \| `"unprotectedHeader"`\>

General JWS verification result with header suggestions from the selected algorithms.

## Type Declaration

### protectedHeader?

• `optional` **protectedHeader?**: [`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>

### unprotectedHeader?

• `optional` **unprotectedHeader?**: [`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |
