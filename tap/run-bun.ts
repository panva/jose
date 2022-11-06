import QUnit from 'qunit'
import run from './run.js'
// @ts-ignore
import * as lib from '#dist/webapi'

const stats: QUnit.DoneDetails = await new Promise((resolve) => {
  run(QUnit, lib, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exit(1)
}
