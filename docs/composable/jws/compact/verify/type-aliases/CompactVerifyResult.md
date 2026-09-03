# Type Alias: CompactVerifyResult\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **CompactVerifyResult**\<`Algorithm`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`CompactVerifyResult`](../../../../../types/interfaces/CompactVerifyResult.md), `"protectedHeader"`\> & `object`

Compact JWS verification result with header suggestions from the selected algorithms.

## Type Declaration

### protectedHeader

• **protectedHeader**: [`SelectedCompactJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedCompactJWSHeaderParameters.md)\<`Algorithm`\>

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |
