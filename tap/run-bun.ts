import QUnit from 'qunit'
import run from './run.js'
import * as lib from '../src/index.js'

const stats: QUnit.DoneDetails = await new Promise((resolve) => {
  run(QUnit, lib, lib, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exit(1)
}
