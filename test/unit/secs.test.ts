import assert from 'node:assert/strict'
import test from 'node:test'

const { secs } = await import('../../src/lib/jwt_claims_set.js')

test('lib/secs.ts', () => {
  for (const sign of ['+', '+ ', '']) {
    for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
      assert.strictEqual(secs(`${sign}1${v}`), 1)
      assert.strictEqual(secs(`${sign}1 ${v}`), 1)
    }
    for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
      assert.strictEqual(secs(`${sign}1${v}`), 60)
      assert.strictEqual(secs(`${sign}1 ${v}`), 60)
    }
    for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
      assert.strictEqual(secs(`${sign}1${v}`), 3600)
      assert.strictEqual(secs(`${sign}1 ${v}`), 3600)
    }
    for (const v of ['day', 'days', 'd']) {
      assert.strictEqual(secs(`${sign}1${v}`), 86400)
      assert.strictEqual(secs(`${sign}1 ${v}`), 86400)
    }
    for (const v of ['week', 'weeks', 'w']) {
      assert.strictEqual(secs(`${sign}1${v}`), 604800)
      assert.strictEqual(secs(`${sign}1 ${v}`), 604800)
    }
    for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
      assert.strictEqual(secs(`${sign}1${v}`), 31557600)
      assert.strictEqual(secs(`${sign}1 ${v}`), 31557600)
    }
  }

  for (const sign of ['-', '- ']) {
    for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
      assert.strictEqual(secs(`${sign}1${v}`), -1)
      assert.strictEqual(secs(`${sign}1 ${v}`), -1)
    }
    for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
      assert.strictEqual(secs(`${sign}1${v}`), -60)
      assert.strictEqual(secs(`${sign}1 ${v}`), -60)
    }
    for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
      assert.strictEqual(secs(`${sign}1${v}`), -3600)
      assert.strictEqual(secs(`${sign}1 ${v}`), -3600)
    }
    for (const v of ['day', 'days', 'd']) {
      assert.strictEqual(secs(`${sign}1${v}`), -86400)
      assert.strictEqual(secs(`${sign}1 ${v}`), -86400)
    }
    for (const v of ['week', 'weeks', 'w']) {
      assert.strictEqual(secs(`${sign}1${v}`), -604800)
      assert.strictEqual(secs(`${sign}1 ${v}`), -604800)
    }
    for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
      assert.strictEqual(secs(`${sign}1${v}`), -31557600)
      assert.strictEqual(secs(`${sign}1 ${v}`), -31557600)
    }
  }

  for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
    assert.strictEqual(secs(`1${v} ago`), -1)
    assert.strictEqual(secs(`1${v} from now`), 1)
    assert.strictEqual(secs(`1 ${v} ago`), -1)
    assert.strictEqual(secs(`1 ${v} from now`), 1)
  }
  for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
    assert.strictEqual(secs(`1${v} ago`), -60)
    assert.strictEqual(secs(`1${v} from now`), 60)
    assert.strictEqual(secs(`1 ${v} ago`), -60)
    assert.strictEqual(secs(`1 ${v} from now`), 60)
  }
  for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
    assert.strictEqual(secs(`1${v} ago`), -3600)
    assert.strictEqual(secs(`1${v} from now`), 3600)
    assert.strictEqual(secs(`1 ${v} ago`), -3600)
    assert.strictEqual(secs(`1 ${v} from now`), 3600)
  }
  for (const v of ['day', 'days', 'd']) {
    assert.strictEqual(secs(`1${v} ago`), -86400)
    assert.strictEqual(secs(`1${v} from now`), 86400)
    assert.strictEqual(secs(`1 ${v} ago`), -86400)
    assert.strictEqual(secs(`1 ${v} from now`), 86400)
  }
  for (const v of ['week', 'weeks', 'w']) {
    assert.strictEqual(secs(`1${v} ago`), -604800)
    assert.strictEqual(secs(`1${v} from now`), 604800)
    assert.strictEqual(secs(`1 ${v} ago`), -604800)
    assert.strictEqual(secs(`1 ${v} from now`), 604800)
  }
  for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
    assert.strictEqual(secs(`1${v} ago`), -31557600)
    assert.strictEqual(secs(`1${v} from now`), 31557600)
    assert.strictEqual(secs(`1 ${v} ago`), -31557600)
    assert.strictEqual(secs(`1 ${v} from now`), 31557600)
  }

  assert.throws(
    () => secs('1 fortnight'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid time period format')
      return true
    },
  )

  assert.throws(
    () => secs('= 1 second'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid time period format')
      return true
    },
  )

  assert.throws(
    () => secs('- 1 second ago'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid time period format')
      return true
    },
  )
})
