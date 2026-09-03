# Type Alias: JWEKeyManagementAlgorithmOf\<Factories\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **JWEKeyManagementAlgorithmOf**\<`Factories`\> = [`Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>, `JWEKeyManagementCapability`\>\[`"algorithm"`\]

Extracts selected JWE `alg` identifiers from a factory tuple.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* readonly [`JWEAlgorithmFactory`](JWEAlgorithmFactory.md)[] |
