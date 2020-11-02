import type { KeyObject } from 'crypto'

const weakMap: WeakMap<KeyObject, number> = new WeakMap()

const getLength = (buf: Buffer, index: number): number => {
  let len = buf.readUInt8(1)

  // Short form
  if ((len & 0x80) === 0) {
    if (index === 0) {
      return len
    }
    return getLength(buf.subarray(2 + len), index - 1)
  }

  // Long form
  const num = len & 0x7f

  len = 0
  for (let i = 0; i < num; i++) {
    len <<= 8
    const j = buf.readUInt8(2 + i)
    len |= j
  }

  if (index === 0) {
    return len
  }

  return getLength(buf.subarray(2 + len), index - 1)
}

const getLengthOfSeqIndex = (sequence: Buffer, index: number): number => {
  const len = sequence.readUInt8(1)

  // short form
  if ((len & 0x80) === 0) {
    return getLength(sequence.subarray(2), index)
  }

  // Long form
  const num = len & 0x7f
  return getLength(sequence.subarray(2 + num), index)
}

const getModulusLength = (key: KeyObject): number => {
  if (weakMap.has(key)) {
    return weakMap.get(key)!
  }

  const modulusLength =
    (getLengthOfSeqIndex(
      key.export({ format: 'der', type: 'pkcs1' }),
      key.type === 'private' ? 1 : 0,
    ) -
      1) <<
    3
  weakMap.set(key, modulusLength)
  return modulusLength
}

export const setModulusLength = (keyObject: KeyObject, modulusLength: number) => {
  weakMap.set(keyObject, modulusLength)
}

export default (key: KeyObject, alg: string) => {
  if (getModulusLength(key) < 2048) {
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
  }
}
