import QUnit from 'qunit'
import run from './run.js'
// @ts-ignore
import * as lib from '#dist'

run(QUnit, lib, lib, (stats) => {
  // @ts-ignore
  globalThis.stats = stats
})
