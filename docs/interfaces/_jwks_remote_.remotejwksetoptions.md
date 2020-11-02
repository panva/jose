# Interface: RemoteJWKSetOptions

Options for the remote JSON Web Key Set.

## Index

### Properties

* [cooldownDuration](_jwks_remote_.remotejwksetoptions.md#cooldownduration)
* [timeoutDuration](_jwks_remote_.remotejwksetoptions.md#timeoutduration)

## Properties

### cooldownDuration

• `Optional` **cooldownDuration**: number

*Defined in [src/jwks/remote.ts:45](https://github.com/panva/jose/blob/v3.x/src/jwks/remote.ts#L45)*

Duration for which no more HTTP requests will be triggered
after a previous successful fetch. Default is 30000.

___

### timeoutDuration

• `Optional` **timeoutDuration**: number

*Defined in [src/jwks/remote.ts:39](https://github.com/panva/jose/blob/v3.x/src/jwks/remote.ts#L39)*

Timeout for the HTTP request. When reached the request will be
aborted and the verification will fail. Default is 5000.
