# Type Alias: FetchImplementation()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **FetchImplementation**: (`url`, `options`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>

See [customFetch](../variables/customFetch.md).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | - |
| `options` | \{`headers`: [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers);`method`: `"GET"`;`redirect`: `"manual"`;`signal`: [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal); \} | - |
| `options.headers` | [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers) | HTTP Headers |
| `options.method` | `"GET"` | The [request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) |
| `options.redirect` | `"manual"` | See [Request.redirect](https://developer.mozilla.org/docs/Web/API/Request/redirect) |
| `options.signal` | [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>
