import { runInNewContext } from 'node:vm'

import assert from 'node:assert/strict'
import test from 'node:test'

import { isObject } from '../../src/lib/validate.js'

test('isObject recognizes stable plain-object prototype shapes', () => {
  assert.strictEqual(isObject({}), true)
  assert.strictEqual(isObject(Object.create(null)), true)
  assert.strictEqual(isObject(Object.create(Object.create(null))), true)
  assert.strictEqual(isObject(runInNewContext('({})')), true)

  class Instance {}
  assert.strictEqual(isObject(new Instance()), false)
  assert.strictEqual(isObject(Object.create({})), false)
  assert.strictEqual(isObject([]), false)
  assert.strictEqual(isObject(new Date()), false)

  for (const input of [undefined, null, true, 0, '', Symbol(), () => {}]) {
    assert.strictEqual(isObject(input), false)
  }

  const callable = () => {}
  Object.setPrototypeOf(callable, null)
  Object.defineProperty(callable, Symbol.toStringTag, { value: 'Object' })
  assert.strictEqual(isObject(callable), false)
})
