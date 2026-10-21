// @ts-ignore
export const isBun = typeof Bun !== 'undefined'

// @ts-ignore
export const isElectron = typeof process !== 'undefined' && process.versions?.electron !== undefined

// @ts-ignore
export const isDeno = typeof Deno !== 'undefined'

export const isBrowser =
  typeof navigator !== 'undefined' && navigator.userAgent?.startsWith?.('Mozilla/5.0 ')

export const isWorkerd =
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

export const isLlrt = typeof process !== 'undefined' && process.release?.name === 'llrt'

// @ts-ignore
export const isNode =
  !isBun && !isElectron && !isDeno && !isLlrt && !isWorkerd && typeof process !== 'undefined'

const BOWSER = 'https://cdn.jsdelivr.net/npm/bowser@2.14.1/src/bowser.js'

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

export const isBlink = isBrowser && (await isEngine('Blink'))

export const isWebKit = isBrowser && (await isEngine('WebKit'))

export const isGecko = isBrowser && (await isEngine('Gecko'))

function isNodeVersionAtLeast(major: number, minor: number) {
  const parts = process.versions.node.split('.').map((i) => parseInt(i, 10))
  return parts[0] > major || (parts[0] === major && parts[1] >= minor)
}

export function supported(algorithm: string): boolean {
  if (/^ML-DSA-/.test(algorithm)) {
    if (isBun || isDeno || isLlrt || isElectron || isBlink) return true
    return isNode && isNodeVersionAtLeast(24, 7)
  }

  // Blink does not support AES-192.
  if (isBlink && /A192/.test(algorithm)) return false

  return true
}
