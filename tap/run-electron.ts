// @ts-ignore
import { app } from 'electron'
import QUnit from 'qunit'
import run from './run.js'
import * as lib from '../src/index.js'

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
