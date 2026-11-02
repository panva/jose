import { syncBuiltinESMExports } from 'node:module'
import workerThreads from 'node:worker_threads'
import zlib from 'node:zlib'

// Undici 8 uses this API, which was introduced after Node.js 20. The mock HTTP
// tests do not clone its objects between workers.
if (Number(process.versions.node.split('.')[0]) === 20) {
  Promise.withResolvers ??= function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void
    let reject!: (reason?: unknown) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }
  workerThreads.markAsUncloneable ??= () => {}
  // The decompression interceptor binds this function during import, even
  // though these tests only request uncompressed mock responses.
  zlib.createZstdDecompress ??= () => {
    throw new Error('Zstandard decompression is unavailable on Node.js 20')
  }
  syncBuiltinESMExports()
}
