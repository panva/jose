# composable/jwks/local

Composable verification using a local JSON Web Key Set.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedCreateLocalJWKSet](interfaces/ComposedCreateLocalJWKSet.md) | A local JWK Set factory restricted to the selected JWS algorithms. |
| [ComposedLocalJWKSet](interfaces/ComposedLocalJWKSet.md) | A local JWK Set resolver restricted to the selected JWS algorithms. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [SelectedFlattenedJWSInput](type-aliases/SelectedFlattenedJWSInput.md) | Flattened JWS input with selected `alg` identifiers suggested by editors. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeLocalJWKSet](functions/composeLocalJWKSet.md) | Composes local JWK Set resolution from one or more asymmetric JWS factories. |

## References

### SelectedJWSHeaderParameters

Re-exports [SelectedJWSHeaderParameters](../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)
