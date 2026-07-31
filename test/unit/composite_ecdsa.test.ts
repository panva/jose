import test from 'ava'

import { concat } from '../../src/lib/buffer_utils.js'
import {
  decodePrivateKey,
  decodeSignature,
  encodePrivateKey,
  encodeSignature,
} from '../../src/lib/composite_ecdsa.js'

const scalarLength = 32

for (const [value, integer] of [
  [[], [0]],
  [[0x7f], [0x7f]],
  [[0x80], [0, 0x80]],
  [[0xff], [0, 0xff]],
  [
    [1, 0],
    [1, 0],
  ],
  [Array(scalarLength - 1).fill(0xff), [0, ...Array(scalarLength - 1).fill(0xff)]],
  [Array(scalarLength).fill(0x7f), Array(scalarLength).fill(0x7f)],
  [Array(scalarLength).fill(0x80), [0, ...Array(scalarLength).fill(0x80)]],
]) {
  test(`P-256 Ecdsa-Sig-Value INTEGER ${Buffer.from(value).toString('hex')}`, (t) => {
    const fixedWidthSignature = new Uint8Array(2 * scalarLength)
    fixedWidthSignature.set(value, scalarLength - value.length)
    fixedWidthSignature.set(value, 2 * scalarLength - value.length)
    const derSignature = Uint8Array.of(
      0x30,
      4 + 2 * integer.length,
      0x02,
      integer.length,
      ...integer,
      0x02,
      integer.length,
      ...integer,
    )
    t.deepEqual(encodeSignature(fixedWidthSignature), derSignature)
    t.deepEqual(decodeSignature(derSignature), fixedWidthSignature)
  })
}

test('P-256 Ecdsa-Sig-Value rejects malformed signatures', (t) => {
  const valid = Uint8Array.of(0x30, 6, 2, 1, 1, 2, 1, 1)
  const integers = [
    [2, 0],
    [2, 1, 0x80],
    [2, 2, 0, 1],
    [2, 2, 0, 0],
    [2, 0x81, 1, 1],
    [2, 0x80, 1, 0, 0],
    [2, scalarLength + 1, ...Array(scalarLength + 1).fill(1)],
    [2, scalarLength + 2, 0, ...Array(scalarLength + 1).fill(0x80)],
    [3, 1, 1],
    [2, 3, 1],
  ]
  for (const integer of integers) {
    for (const first of [true, false]) {
      const body = first ? [...integer, 2, 1, 1] : [2, 1, 1, ...integer]
      const derSignature = Uint8Array.of(0x30, body.length, ...body)
      t.throws(() => decodeSignature(derSignature), { instanceOf: TypeError })
    }
  }
  for (const derSignature of [
    new Uint8Array(),
    valid.subarray(0, 7),
    Uint8Array.of(0x31, ...valid.subarray(1)),
    Uint8Array.of(0x30, 0x81, 6, ...valid.subarray(2)),
    Uint8Array.of(0x30, 0x80, ...valid.subarray(2), 0, 0),
    Uint8Array.of(0x30, 9, ...valid.subarray(2), 2, 1, 1),
    concat(valid, Uint8Array.of(0)),
    Uint8Array.of(0x30, 100, 2, 48, ...Array(48).fill(1), 2, 48, ...Array(48).fill(1)),
  ]) {
    t.throws(() => decodeSignature(derSignature), { instanceOf: TypeError })
  }
})

test('P-256 ECPrivateKey encoding', (t) => {
  const privateScalar = Uint8Array.from({ length: scalarLength }, (_, i) => i)
  const privateKeyPrefix = '30310201010420'
  const privateKeySuffix = 'a00a06082a8648ce3d030107'
  const ecPrivateKey = new Uint8Array(
    Buffer.from(
      privateKeyPrefix + Buffer.from(privateScalar).toString('hex') + privateKeySuffix,
      'hex',
    ),
  )
  t.deepEqual(encodePrivateKey(privateScalar), ecPrivateKey)
  t.deepEqual(decodePrivateKey(ecPrivateKey), privateScalar)

  for (const index of [
    ...Array(7).keys(),
    ...Array.from({ length: privateKeySuffix.length / 2 }, (_, i) => 7 + scalarLength + i),
  ]) {
    const malformed = ecPrivateKey.slice()
    malformed[index] ^= 1
    t.throws(() => decodePrivateKey(malformed), { instanceOf: TypeError })
  }
  for (const malformed of [
    privateScalar,
    ecPrivateKey.subarray(0, ecPrivateKey.length - 1),
    concat(ecPrivateKey, Uint8Array.of(0)),
    new Uint8Array(Buffer.from('303e0201010430' + '00'.repeat(48) + 'a00706052b81040022', 'hex')),
  ]) {
    t.throws(() => decodePrivateKey(malformed), { instanceOf: TypeError })
  }
})

test('P-256 Ecdsa-Sig-Value and ECPrivateKey reject unsupported lengths', (t) => {
  for (const length of [0, 1, 62, 63, 65, 66, 96, 132]) {
    t.throws(() => encodeSignature(new Uint8Array(length)), { instanceOf: TypeError })
  }
  for (const length of [0, 1, 31, 33, 47, 48, 49, 66]) {
    t.throws(() => encodePrivateKey(new Uint8Array(length)), { instanceOf: TypeError })
  }
})
