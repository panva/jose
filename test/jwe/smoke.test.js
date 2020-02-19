const test = require('ava')

const { existsSync } = require('fs')
const path = require('path')

const fixtures = require('../fixtures')

Object.entries(fixtures.PEM).forEach(([type, { testEnc = true }]) => {
  if (testEnc) {
    const filename = `smoke.${type.toLowerCase().replace('-', '')}.test.js`
    test(`${type} is tested`, t => {
      t.true(existsSync(path.join(__dirname, filename)))
    })
  }
})
