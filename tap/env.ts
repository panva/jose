// @ts-ignore
export const isBun = typeof Bun !== 'undefined'

// @ts-ignore
export const isElectron = typeof process !== 'undefined' && process.versions.electron !== undefined

// @ts-ignore
export const isNode = !isBun && !isElectron && typeof process !== 'undefined'

// @ts-ignore
export const isDeno = typeof Deno !== 'undefined'

// @ts-ignore
export const isEdgeRuntime = typeof EdgeRuntime !== 'undefined'

export const isBrowser =
  typeof navigator !== 'undefined' && navigator.userAgent?.startsWith?.('Mozilla/5.0 ')

export const isWorkerd =
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

const BOWSER = 'https://cdn.jsdelivr.net/npm/bowser@2.11.0/src/bowser.js'

let parsedUserAgent: any
async function parseUserAgent() {
  const { default: Bowser } = await import(BOWSER)
  parsedUserAgent || (parsedUserAgent = Bowser.parse(window.navigator.userAgent))
  return parsedUserAgent
}

async function isEngine(engine: string) {
  const userAgentData = await parseUserAgent()
  return userAgentData.engine.name === engine
}

export function isBrowserVersionAtLeast(version: number) {
  if (!parsedUserAgent) throw new Error()
  return parseInt(parsedUserAgent.browser.version.split('.')[0], 10) >= version
}

export const isBlink = isBrowser && (await isEngine('Blink'))

export const isWebKit = isBrowser && (await isEngine('WebKit'))

export const isGecko = isBrowser && (await isEngine('Gecko'))
