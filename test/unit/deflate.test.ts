import assert from 'node:assert/strict'
import test from 'node:test'

import { decompress } from '../../src/lib/deflate.js'
import { JWEInvalid } from '../../src/util/errors.js'

test('decompression cancels its reader when the output exceeds the limit', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'DecompressionStream')
  try {
    for (const rejectCancellation of [false, true]) {
      let cancellations = 0
      Object.defineProperty(globalThis, 'DecompressionStream', {
        configurable: true,
        value: class {
          writable = new WritableStream()
          readable = new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(new Uint8Array(2))
            },
            async cancel() {
              cancellations++
              if (rejectCancellation) throw new Error('cancel failed')
            },
          })
        },
      })

      await assert.rejects(decompress(new Uint8Array(), 1), (error) => {
        assert.ok(error instanceof JWEInvalid)
        assert.strictEqual(error.message, 'Decompressed plaintext exceeded the configured limit')
        return true
      })
      assert.strictEqual(cancellations, 1)
    }
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'DecompressionStream', descriptor)
    else Reflect.deleteProperty(globalThis, 'DecompressionStream')
  }
})
