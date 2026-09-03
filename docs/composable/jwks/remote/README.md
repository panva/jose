# composable/jwks/remote

Composable verification using a remote JSON Web Key Set.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ComposedCreateRemoteJWKSet](interfaces/ComposedCreateRemoteJWKSet.md) | A remote JWK Set factory restricted to the selected JWS algorithms. |
| [ComposedRemoteJWKSet](interfaces/ComposedRemoteJWKSet.md) | A remote JWK Set resolver restricted to the selected JWS algorithms. |

## Functions

| Function | Description |
| ------ | ------ |
| [composeRemoteJWKSet](functions/composeRemoteJWKSet.md) | Composes remote JWK Set resolution from one or more asymmetric JWS factories. |
