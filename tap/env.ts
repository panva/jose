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
      return false
  }

  switch (identifier) {
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      return isNode && op !== 'pem export'
  }

  if (isBlink) {
    switch (identifier) {
      case 'A192CBC-HS384':
      case 'A192GCM':
      case 'A192GCMKW':
      case 'A192KW':
      case 'PBES2-HS384+A192KW':
        return false
    }
  }

  if (isElectron) {
    switch (identifier) {
      case 'A128KW':
      case 'A192KW':
      case 'A256KW':
      case 'PBES2-HS256+A128KW':
      case 'PBES2-HS384+A192KW':
      case 'PBES2-HS512+A256KW':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW':
        return false
    }
  }

  if (isBun && identifier === 'X25519') {
    switch (op) {
      case 'private jwk import':
      case 'public jwk import':
      case 'pem import':
        return true
      default:
        return false
    }
  }

  if (isDeno) {
    if (
      (identifier === 'P-521' || identifier === 'ES512') &&
      op !== 'pem import' &&
      op !== 'public jwk import'
    ) {
      return false
    }
  }

  return true
}
