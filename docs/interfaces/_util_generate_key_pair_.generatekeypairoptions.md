# Interface: GenerateKeyPairOptions

## Index

### Properties

* [crv](_util_generate_key_pair_.generatekeypairoptions.md#crv)

## Properties

### crv

• `Optional` **crv**: string

*Defined in [src/util/generate_key_pair.ts:10](https://github.com/panva/jose/blob/v3.1.0/src/util/generate_key_pair.ts#L10)*

The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate.
The curve must be both supported on the runtime as well as applicable for
the given JWA algorithm identifier.
