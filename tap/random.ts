// @ts-ignore
const nodeCrypto = await import('crypto').catch(() => {})

export default (byteLength = 16) => {
  try {
    return crypto.getRandomValues(new Uint8Array(byteLength))
  } catch {
    return nodeCrypto.randomFillSync(new Uint8Array(byteLength))
  }
}
