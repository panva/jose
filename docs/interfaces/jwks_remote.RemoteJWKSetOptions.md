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

• `Optional` **agent**: `any`

An instance of [http.Agent](https://nodejs.org/api/http.html#http_class_http_agent)
or [https.Agent](https://nodejs.org/api/https.html#https_class_https_agent) to pass
to the [http.get](https://nodejs.org/api/http.html#http_http_get_options_callback)
or [https.get](https://nodejs.org/api/https.html#https_https_get_options_callback)
method's options. Use when behind an http(s) proxy.
This is a Node.js runtime specific option, it is ignored
when used outside of Node.js runtime.

#### Defined in

[jwks/remote.ts:61](https://github.com/panva/jose/blob/v3.16.1/src/jwks/remote.ts#L61)

___

### cooldownDuration

• `Optional` **cooldownDuration**: `number`

Duration for which no more HTTP requests will be triggered
after a previous successful fetch. Default is 30000.

#### Defined in

[jwks/remote.ts:50](https://github.com/panva/jose/blob/v3.16.1/src/jwks/remote.ts#L50)

___

### timeoutDuration

• `Optional` **timeoutDuration**: `number`

Timeout for the HTTP request. When reached the request will be
aborted and the verification will fail. Default is 5000.

#### Defined in

[jwks/remote.ts:44](https://github.com/panva/jose/blob/v3.16.1/src/jwks/remote.ts#L44)
