export function isCloudflareWorkers(): boolean {
  // @ts-expect-error
  return typeof WebSocketPair === 'function'
}

export function isNodeJs(): boolean {
  try {
    // @ts-ignore
    return process.versions.node !== undefined
  } catch {
    return false
  }
}
