# Interface: RemoteJWKSetOptions

[jwks/remote](../modules/jwks_remote.md).RemoteJWKSetOptions

Options for the remote JSON Web Key Set.

## Table of contents

### Properties

- [agent](jwks_remote.RemoteJWKSetOptions.md#agent)
- [cooldownDuration](jwks_remote.RemoteJWKSetOptions.md#cooldownduration)
- [timeoutDuration](jwks_remote.RemoteJWKSetOptions.md#timeoutduration)

## Properties

### agent

• `Optional` **agent**: `Agent` \| `Agent`

An instance of http.Agent or https.Agent to pass to the http.get or
https.get method options. Use when behind an http(s) proxy.
This is a Node.js runtime specific option, it is ignored
when used outside of Node.js runtime.

#### Defined in

[jwks/remote.ts:56](https://github.com/panva/jose/blob/v3.14.1/src/jwks/remote.ts#L56)

___

### cooldownDuration

• `Optional` **cooldownDuration**: `number`

Duration for which no more HTTP requests will be triggered
after a previous successful fetch. Default is 30000.

#### Defined in

[jwks/remote.ts:48](https://github.com/panva/jose/blob/v3.14.1/src/jwks/remote.ts#L48)

___

### timeoutDuration

• `Optional` **timeoutDuration**: `number`

Timeout for the HTTP request. When reached the request will be
aborted and the verification will fail. Default is 5000.

#### Defined in

[jwks/remote.ts:42](https://github.com/panva/jose/blob/v3.14.1/src/jwks/remote.ts#L42)
