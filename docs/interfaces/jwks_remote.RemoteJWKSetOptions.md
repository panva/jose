# Interface: RemoteJWKSetOptions

[💗 Help the project](https://github.com/sponsors/panva)

Options for the remote JSON Web Key Set.

## Table of contents

### Properties

- [agent](jwks_remote.RemoteJWKSetOptions.md#agent)
- [cacheMaxAge](jwks_remote.RemoteJWKSetOptions.md#cachemaxage)
- [cooldownDuration](jwks_remote.RemoteJWKSetOptions.md#cooldownduration)
- [headers](jwks_remote.RemoteJWKSetOptions.md#headers)
- [timeoutDuration](jwks_remote.RemoteJWKSetOptions.md#timeoutduration)

## Properties

### agent

• `Optional` **agent**: `any`

An instance of [http.Agent](https://nodejs.org/api/http.html#http_class_http_agent) or
[https.Agent](https://nodejs.org/api/https.html#https_class_https_agent) to pass to the
[http.get](https://nodejs.org/api/http.html#http_http_get_options_callback) or
[https.get](https://nodejs.org/api/https.html#https_https_get_options_callback) method's
options. Use when behind an http(s) proxy. This is a Node.js runtime specific option, it is
ignored when used outside of Node.js runtime.

___

### cacheMaxAge

• `Optional` **cacheMaxAge**: `number`

Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10 minutes).

___

### cooldownDuration

• `Optional` **cooldownDuration**: `number`

Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
successful fetch. Default is 30000 (30 seconds).

___

### headers

• `Optional` **headers**: `Record`<`string`, `string`\>

Optional headers to be sent with the HTTP request.

___

### timeoutDuration

• `Optional` **timeoutDuration**: `number`

Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
the verification will fail. Default is 5000 (5 seconds).
