// @ts-ignore
export const isBun = typeof Bun !== 'undefined'

// @ts-ignore
export const isElectron = typeof process !== 'undefined' && process.versions.electron !== undefined

// @ts-ignore
export const isNode = !isBun && !isElectron && typeof process !== 'undefined'

// @ts-ignore
export const isNodeCrypto = isNode && [...process.argv].reverse()[0] === '#dist'

// @ts-ignore
export const isNodeWebCrypto = isNode && [...process.argv].reverse()[0] !== '#dist'

// @ts-ignore
export const isDeno = typeof Deno !== 'undefined'

// @ts-ignore
export const isEdgeRuntime = typeof EdgeRuntime !== 'undefined'

export const isBrowser =
  typeof navigator !== 'undefined' && navigator.userAgent?.startsWith?.('Mozilla/5.0 ')

export const isWorkers =
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

export const isChromium =
  isBrowser &&
  (await import(
    // @ts-ignore
    'https://cdn.jsdelivr.net/npm/bowser@2.11.0/src/bowser.js'
  ).then(({ default: QUnit }) => QUnit.parse(window.navigator.userAgent).engine.name === 'Blink'))

// @ts-ignore
export const hasZlib = isNode && [...process.argv].reverse()[0] !== '#dist/webapi'
