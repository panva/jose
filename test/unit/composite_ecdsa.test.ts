import test from 'ava'

import { concat } from '../../src/lib/buffer_utils.js'
import {
  decodePrivateKey,
  decodeSignature,
  encodePrivateKey,
  encodeSignature,
} from '../../src/lib/composite_ecdsa.js'

for (const size of [32, 48]) {
  for (const [value, integer] of [
    [[], [0]],
    [[0x7f], [0x7f]],
    [[0x80], [0, 0x80]],
    [[0xff], [0, 0xff]],
    [
      [1, 0],
      [1, 0],
    ],
    [Array(size - 1).fill(0xff), [0, ...Array(size - 1).fill(0xff)]],
    [Array(size).fill(0x7f), Array(size).fill(0x7f)],
    [Array(size).fill(0x80), [0, ...Array(size).fill(0x80)]],
  ]) {
    test(`ECDSA-${size * 8} signature INTEGER ${Buffer.from(value).toString('hex')}`, (t) => {
      const raw = new Uint8Array(2 * size)
      raw.set(value, size - value.length)
      raw.set(value, 2 * size - value.length)
      const expected = Uint8Array.of(
        0x30,
        4 + 2 * integer.length,
        0x02,
        integer.length,
        ...integer,
        0x02,
        integer.length,
        ...integer,
      )
      t.deepEqual(encodeSignature(raw), expected)
      t.deepEqual(decodeSignature(expected, size), raw)
    })
  }

  test(`ECDSA-${size * 8} rejects malformed signatures`, (t) => {
    const valid = Uint8Array.of(0x30, 6, 2, 1, 1, 2, 1, 1)
    const integers = [
      [2, 0],
      [2, 1, 0x80],
      [2, 2, 0, 1],
      [2, 2, 0, 0],
      [2, 0x81, 1, 1],
      [2, 0x80, 1, 0, 0],
      [2, size + 1, ...Array(size + 1).fill(1)],
      [2, size + 2, 0, ...Array(size + 1).fill(0x80)],
      [3, 1, 1],
      [2, 3, 1],
    ]
    for (const integer of integers) {
      for (const first of [true, false]) {
        const body = first ? [...integer, 2, 1, 1] : [2, 1, 1, ...integer]
        const der = Uint8Array.of(0x30, body.length, ...body)
        t.throws(() => decodeSignature(der, size), { instanceOf: TypeError })
      }
    }
    for (const der of [
      new Uint8Array(),
      valid.subarray(0, 7),
      Uint8Array.of(0x31, ...valid.subarray(1)),
      Uint8Array.of(0x30, 0x81, 6, ...valid.subarray(2)),
      Uint8Array.of(0x30, 0x80, ...valid.subarray(2), 0, 0),
      Uint8Array.of(0x30, 9, ...valid.subarray(2), 2, 1, 1),
      concat(valid, Uint8Array.of(0)),
    ]) {
      t.throws(() => decodeSignature(der, size), { instanceOf: TypeError })
    }
  })

  test(`ECDSA-${size * 8} private key encoding`, (t) => {
    const raw = Uint8Array.from({ length: size }, (_, i) => i)
    const header = size === 32 ? '30310201010420' : '303e0201010430'
    const footer = size === 32 ? 'a00a06082a8648ce3d030107' : 'a00706052b81040022'
    const expected = new Uint8Array(
      Buffer.from(header + Buffer.from(raw).toString('hex') + footer, 'hex'),
    )
    t.deepEqual(encodePrivateKey(raw), expected)
    t.deepEqual(decodePrivateKey(expected, size), raw)

    for (const index of [
      ...Array(7).keys(),
      ...Array.from({ length: footer.length / 2 }, (_, i) => 7 + size + i),
    ]) {
      const malformed = expected.slice()
      malformed[index] ^= 1
      t.throws(() => decodePrivateKey(malformed, size), { instanceOf: TypeError })
    }
    for (const malformed of [
      raw,
      expected.subarray(0, expected.length - 1),
      concat(expected, Uint8Array.of(0)),
      encodePrivateKey(new Uint8Array(size === 32 ? 48 : 32)),
    ]) {
      t.throws(() => decodePrivateKey(malformed, size), { instanceOf: TypeError })
    }
  })
}

test('ECDSA encodings reject unsupported sizes', (t) => {
  for (const size of [0, 1, 31, 33, 47, 49, 66]) {
    t.throws(() => encodeSignature(new Uint8Array(2 * size)), { instanceOf: TypeError })
    t.throws(() => decodeSignature(new Uint8Array(), size), { instanceOf: TypeError })
    t.throws(() => encodePrivateKey(new Uint8Array(size)), { instanceOf: TypeError })
    t.throws(() => decodePrivateKey(new Uint8Array(), size), { instanceOf: TypeError })
  }
})
