import Bowser from 'bowser'

// @ts-ignore
export const isBun = typeof Bun !== 'undefined'

// @ts-ignore
export const isElectron = typeof process !== 'undefined' && process.versions.electron !== undefined

// @ts-ignore
export const isNode = !isBun && !isElectron && typeof process !== 'undefined'

// @ts-ignore
export const isNodeCrypto = isNode && process.argv.at(-1) === '#dist'

// @ts-ignore
export const isNodeWebCrypto = isNode && process.argv.at(-1) === '#dist/webapi'

// @ts-ignore
export const isDeno = typeof Deno !== 'undefined'

// @ts-ignore
export const isEdgeRuntime = typeof EdgeRuntime !== 'undefined'

export const isBrowser =
  typeof navigator !== 'undefined' && navigator.userAgent?.startsWith?.('Mozilla/5.0 ')

export const isWorkers =
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

export const isChromium =
  isBrowser && Bowser.parse(window.navigator.userAgent).engine.name === 'Blink'
