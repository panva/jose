function getGlobal() {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  throw new Error('unable to locate global object')
}

export default getGlobal()
export function isCloudflareWorkers(): boolean {
  try {
    // @ts-expect-error
    return getGlobal().WebSocketPair !== undefined
  } catch {
    return false
  }
}
export function isNodeJs(): boolean {
  try {
    // @deno-expect-error
    return getGlobal().process?.versions?.node !== undefined
  } catch {
    return false
  }
}
