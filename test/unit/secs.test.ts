import test from 'ava'

const { default: secs } = await import('../../src/lib/secs.js')

test('lib/secs.ts', (t) => {
  for (const sign of ['+', '+ ', '']) {
    for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
      t.is(secs(`${sign}1${v}`), 1)
      t.is(secs(`${sign}1 ${v}`), 1)
    }
    for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
      t.is(secs(`${sign}1${v}`), 60)
      t.is(secs(`${sign}1 ${v}`), 60)
    }
    for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
      t.is(secs(`${sign}1${v}`), 3600)
      t.is(secs(`${sign}1 ${v}`), 3600)
    }
    for (const v of ['day', 'days', 'd']) {
      t.is(secs(`${sign}1${v}`), 86400)
      t.is(secs(`${sign}1 ${v}`), 86400)
    }
    for (const v of ['week', 'weeks', 'w']) {
      t.is(secs(`${sign}1${v}`), 604800)
      t.is(secs(`${sign}1 ${v}`), 604800)
    }
    for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
      t.is(secs(`${sign}1${v}`), 31557600)
      t.is(secs(`${sign}1 ${v}`), 31557600)
    }
  }

  for (const sign of ['-', '- ']) {
    for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
      t.is(secs(`${sign}1${v}`), -1)
      t.is(secs(`${sign}1 ${v}`), -1)
    }
    for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
      t.is(secs(`${sign}1${v}`), -60)
      t.is(secs(`${sign}1 ${v}`), -60)
    }
    for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
      t.is(secs(`${sign}1${v}`), -3600)
      t.is(secs(`${sign}1 ${v}`), -3600)
    }
    for (const v of ['day', 'days', 'd']) {
      t.is(secs(`${sign}1${v}`), -86400)
      t.is(secs(`${sign}1 ${v}`), -86400)
    }
    for (const v of ['week', 'weeks', 'w']) {
      t.is(secs(`${sign}1${v}`), -604800)
      t.is(secs(`${sign}1 ${v}`), -604800)
    }
    for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
      t.is(secs(`${sign}1${v}`), -31557600)
      t.is(secs(`${sign}1 ${v}`), -31557600)
    }
  }

  for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
    t.is(secs(`1${v} ago`), -1)
    t.is(secs(`1${v} from now`), 1)
    t.is(secs(`1 ${v} ago`), -1)
    t.is(secs(`1 ${v} from now`), 1)
  }
  for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
    t.is(secs(`1${v} ago`), -60)
    t.is(secs(`1${v} from now`), 60)
    t.is(secs(`1 ${v} ago`), -60)
    t.is(secs(`1 ${v} from now`), 60)
  }
  for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
    t.is(secs(`1${v} ago`), -3600)
    t.is(secs(`1${v} from now`), 3600)
    t.is(secs(`1 ${v} ago`), -3600)
    t.is(secs(`1 ${v} from now`), 3600)
  }
  for (const v of ['day', 'days', 'd']) {
    t.is(secs(`1${v} ago`), -86400)
    t.is(secs(`1${v} from now`), 86400)
    t.is(secs(`1 ${v} ago`), -86400)
    t.is(secs(`1 ${v} from now`), 86400)
  }
  for (const v of ['week', 'weeks', 'w']) {
    t.is(secs(`1${v} ago`), -604800)
    t.is(secs(`1${v} from now`), 604800)
    t.is(secs(`1 ${v} ago`), -604800)
    t.is(secs(`1 ${v} from now`), 604800)
  }
  for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
    t.is(secs(`1${v} ago`), -31557600)
    t.is(secs(`1${v} from now`), 31557600)
    t.is(secs(`1 ${v} ago`), -31557600)
    t.is(secs(`1 ${v} from now`), 31557600)
  }

  t.throws(() => secs('1 fortnight'), {
    instanceOf: TypeError,
    message: 'Invalid time period format',
  })

  t.throws(() => secs('= 1 second'), {
    instanceOf: TypeError,
    message: 'Invalid time period format',
  })

  t.throws(() => secs('- 1 second ago'), {
    instanceOf: TypeError,
    message: 'Invalid time period format',
  })
})
