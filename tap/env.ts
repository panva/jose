// @ts-ignore
export const isBun = typeof Bun !== 'undefined'

// @ts-ignore
export const isElectron = typeof process !== 'undefined' && process.versions?.electron !== undefined

// @ts-ignore
export const isDeno = typeof Deno !== 'undefined'

// @ts-ignore
export const isNode = !isBun && !isElectron && !isDeno && typeof process !== 'undefined'

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

export function supported(identifier?: string, op?: string) {
  switch (identifier) {
    case 'RSA1_5':
    case 'X448':
    case 'Ed448':
    case 'ES256K':
    case 'secp256k1':
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      return false
  }

  switch (true) {
    case isBlink && identifier === 'A192CBC-HS384':
    case isBlink && identifier === 'A192GCM':
    case isBlink && identifier === 'A192GCMKW':
    case isBlink && identifier === 'A192KW':
    case isBlink && identifier === 'PBES2-HS384+A192KW':
    case isBlink && identifier === 'EdDSA':
    case isBlink && identifier === 'Ed25519':
      return false
    case isElectron && identifier === 'A128KW':
    case isElectron && identifier === 'A192KW':
    case isElectron && identifier === 'A256KW':
    case isElectron && identifier === 'PBES2-HS256+A128KW':
    case isElectron && identifier === 'PBES2-HS384+A192KW':
    case isElectron && identifier === 'PBES2-HS512+A256KW':
    case isElectron && identifier === 'ECDH-ES+A128KW':
    case isElectron && identifier === 'ECDH-ES+A192KW':
    case isElectron && identifier === 'ECDH-ES+A256KW':
      return false
    case isDeno && identifier === 'P-521' && op !== 'pem import' && op !== 'public jwk import':
    case isDeno && identifier === 'ES512' && op !== 'pem import' && op !== 'public jwk import':
      return false
    case isBun && identifier === 'X25519':
      return false
    default:
      return true
  }
}
