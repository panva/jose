export function isCloudflareWorkers(): boolean {
  // @ts-expect-error
  return typeof WebSocketPair === 'function'
}
