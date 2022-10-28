import Bowser from 'bowser'

// @ts-ignore
export const isBun = typeof Bun !== 'undefined'
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
