const test = require('ava')

const secs = require('../../lib/help/secs')

const values = {
  sec: 1,
  secs: 1,
  second: 1,
  seconds: 1,
  s: 1,
  minute: 60,
  minutes: 60,
  min: 60,
  mins: 60,
  m: 60,
  hour: 3600,
  hours: 3600,
  hr: 3600,
  hrs: 3600,
  h: 3600,
  day: 86400,
  days: 86400,
  d: 86400,
  week: 604800,
  weeks: 604800,
  w: 604800,
  year: 31557600,
  years: 31557600,
  yr: 31557600,
  yrs: 31557600,
  y: 31557600
}

test('invalid formats', t => {
  ;['-1w', '2.2.w', '2.w', '2.', '', '2 w       ', '     2w'].forEach((val) => {
    t.throws(() => {
      secs(val)
    }, { instanceOf: TypeError })
  })
})

Object.entries(values).forEach(([unit, value]) => {
  test(`0 ${unit}`, t => {
    t.is(0, secs(`0 ${unit}`))
  })

  test(`1 ${unit}`, t => {
    t.is(value, secs(`1 ${unit}`))
  })

  test(`2${unit}`, t => {
    t.is(2 * value, secs(`2${unit}`))
  })

  test(`2.5${unit}`, t => {
    t.is(Math.round(2.5 * value), secs(`2.5${unit}`))
  })
})
