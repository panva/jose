// @ts-ignore
const { app } = require('electron')
import QUnit from 'qunit'
import run from './run.js'

// @ts-ignore
const lib = require('#dist')

app.on('ready', () => {
  run(QUnit, lib, lib, (stats) => {
    if (stats?.failed !== 0) {
      // @ts-ignore
      app.exit(1)
    } else {
      app.exit(0)
    }
  })
})
