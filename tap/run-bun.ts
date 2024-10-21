import QUnit from 'qunit'
import run from './run.js'
// @ts-ignore
import * as lib from '#dist'

const stats: QUnit.DoneDetails = await new Promise((resolve) => {
  run(QUnit, lib, lib, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exit(1)
}
