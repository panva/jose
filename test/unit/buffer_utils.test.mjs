import test from 'ava'

const { uint32be } = await import('#dist/lib/buffer_utils')

test('lib/buffer_utils.ts', (t) => {
  t.throws(() => uint32be(-1), { instanceOf: RangeError })
  t.throws(() => uint32be(2 ** 32), { instanceOf: RangeError })
})
