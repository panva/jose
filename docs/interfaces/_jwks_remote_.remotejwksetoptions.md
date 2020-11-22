# Interface: RemoteJWKSetOptions

Options for the remote JSON Web Key Set.

## Index

### Properties

* [agent](_jwks_remote_.remotejwksetoptions.md#agent)
* [cooldownDuration](_jwks_remote_.remotejwksetoptions.md#cooldownduration)
* [timeoutDuration](_jwks_remote_.remotejwksetoptions.md#timeoutduration)

## Properties

### agent

• `Optional` **agent**: HttpAgent \| HttpsAgent

*Defined in [src/jwks/remote.ts:55](https://github.com/panva/jose/blob/v3.1.0/src/jwks/remote.ts#L55)*

An instance of http.Agent or https.Agent to pass to the http.get or
https.get method options. Use when behind an http(s) proxy.
This is a Node.js runtime specific option, it is ignored
when used outside of Node.js runtime.

___

### cooldownDuration

• `Optional` **cooldownDuration**: number

*Defined in [src/jwks/remote.ts:47](https://github.com/panva/jose/blob/v3.1.0/src/jwks/remote.ts#L47)*

Duration for which no more HTTP requests will be triggered
after a previous successful fetch. Default is 30000.

___

### timeoutDuration

• `Optional` **timeoutDuration**: number

*Defined in [src/jwks/remote.ts:41](https://github.com/panva/jose/blob/v3.1.0/src/jwks/remote.ts#L41)*

Timeout for the HTTP request. When reached the request will be
aborted and the verification will fail. Default is 5000.
