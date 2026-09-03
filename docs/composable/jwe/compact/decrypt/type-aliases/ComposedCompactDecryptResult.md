# Type Alias: ComposedCompactDecryptResult\<Factories\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **ComposedCompactDecryptResult**\<`Factories`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`CompactDecryptResult`](../../../../../types/interfaces/CompactDecryptResult.md), `"protectedHeader"`\> & `object`

A Compact JWE decryption result with header suggestions from the selected algorithms.

## Type Declaration

### protectedHeader

• **protectedHeader**: [`ComposedCompactJWEHeader`](../../../../jwt/decrypt/interfaces/ComposedCompactJWEHeader.md)\<`Factories`\>

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |
