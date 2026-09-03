# Type Alias: JWTVerifyResult\<PayloadType, Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **JWTVerifyResult**\<`PayloadType`, `Algorithm`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTVerifyResult`](../../../../types/interfaces/JWTVerifyResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object`

JWT verification result with header suggestions from the selected JWS algorithms.

## Type Declaration

### protectedHeader

• **protectedHeader**: [`SelectedJWTHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWTHeaderParameters.md)\<`Algorithm`\>

## Type Parameters

| Type Parameter |
| ------ |
| `PayloadType` |
| `Algorithm` *extends* `string` |
