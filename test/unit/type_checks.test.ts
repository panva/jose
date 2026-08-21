import { runInNewContext } from 'node:vm'

import test from 'ava'

import { isObject } from '../../src/lib/type_checks.js'

test('isObject recognizes stable plain-object prototype shapes', (t) => {
  t.true(isObject({}))
  t.true(isObject(Object.create(null)))
  t.true(isObject(Object.create(Object.create(null))))
  t.true(isObject(runInNewContext('({})')))

  class Instance {}
  t.false(isObject(new Instance()))
  t.false(isObject(Object.create({})))
  t.false(isObject([]))
  t.false(isObject(new Date()))
})
