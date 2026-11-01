import test from 'ava'

import { decompress } from '../../src/lib/deflate.js'
import { JWEInvalid } from '../../src/util/errors.js'

test.serial('decompression cancels its reader when the output exceeds the limit', async (t) => {
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

      await t.throwsAsync(decompress(new Uint8Array(), 1), {
        instanceOf: JWEInvalid,
        message: 'Decompressed plaintext exceeded the configured limit',
      })
      t.is(cancellations, 1)
    }
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'DecompressionStream', descriptor)
    else Reflect.deleteProperty(globalThis, 'DecompressionStream')
  }
})
