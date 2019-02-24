const test = require('ava')

const { JOSEMultiError } = require('../../lib/errors')

test('flattens the errors', t => {
  t.plan(5)
  const multi = new JOSEMultiError([
    new Error(),
    new Error(),
    new JOSEMultiError([
      new Error()
    ]),
    new JOSEMultiError([
      new Error(),
      new JOSEMultiError([
        new Error()
      ])
    ])
  ])

  for (const error of multi) {
    t.false(error instanceof JOSEMultiError)
  }
})
