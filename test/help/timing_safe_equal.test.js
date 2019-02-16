const test = require('ava')

const timingSafeEqual = require('../../lib/help/timing_safe_equal')

test('same length buffers', t => {
  t.is(true, timingSafeEqual(Buffer.from('foo'), Buffer.from('foo')))
  t.is(false, timingSafeEqual(Buffer.from('foo'), Buffer.from('bar')))
})

test('different length buffers', t => {
  t.is(false, timingSafeEqual(Buffer.from('foo'), Buffer.from('barbaz')))
})
