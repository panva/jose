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

export const isWorkerd =
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

const BOWSER = 'https://cdn.jsdelivr.net/npm/bowser@2.11.0/src/bowser.js'

async function isEngine(engine: string) {
  const { default: Bowser } = await import(BOWSER)
  return Bowser.parse(window.navigator.userAgent).engine.name === engine
}

export const isBlink = isBrowser && (await isEngine('Blink'))

export const isWebKit = isBrowser && (await isEngine('WebKit'))

export const isGecko = isBrowser && (await isEngine('Gecko'))

// @ts-ignore
export const hasZlib = isNode && [...process.argv].reverse()[0] !== '#dist/webapi'
