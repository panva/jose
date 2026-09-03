# Type Alias: ComposedJWTDecryptResult\<Factories, PayloadType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **ComposedJWTDecryptResult**\<`Factories`, `PayloadType`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTDecryptResult`](../../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object`

A JWT decryption result with protected-header suggestions from the selected JWE algorithms.

## Type Declaration

### protectedHeader

• **protectedHeader**: [`ComposedCompactJWEHeader`](../interfaces/ComposedCompactJWEHeader.md)\<`Factories`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) | - |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |
