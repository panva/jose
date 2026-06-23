import test from 'ava'

import { decode } from '../../src/util/base64url.js'

// `+` and `/` are valid Base64 but not Base64URL. Uint8Array.fromBase64 with
// the base64url alphabet rejects them, so the no-native-fromBase64 fallback
// (which translates `-_` to `+/` and decodes via atob) must reject them too
// instead of accepting them as standard Base64.

test('decode rejects + and / (native path)', (t) => {
  t.throws(() => decode('+/+/'))
  t.throws(() => decode('AB+CD'))
  t.deepEqual(decode('-_-_'), new Uint8Array([0xfb, 0xff, 0xbf]))
})

test.serial('decode rejects + and / (fallback path)', (t) => {
  // @ts-ignore
  const native = Uint8Array.fromBase64
  try {
    // @ts-ignore
    delete Uint8Array.fromBase64
    t.throws(() => decode('+/+/'), { instanceOf: TypeError })
    t.throws(() => decode('AB/CD'), { instanceOf: TypeError })
    t.deepEqual(decode('-_-_'), new Uint8Array([0xfb, 0xff, 0xbf]))
  } finally {
    // @ts-ignore
    Uint8Array.fromBase64 = native
  }
})
