import test from 'ava'

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto'
const { uint32be } = await import(`${root}/lib/buffer_utils`)

test('lib/buffer_utils.ts', (t) => {
  t.throws(() => uint32be(-1), { instanceOf: RangeError })
  t.throws(() => uint32be(2 ** 32), { instanceOf: RangeError })
})
