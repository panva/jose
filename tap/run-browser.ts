import QUnit from 'qunit'
import run from './run.js'
import * as lib from '../src/index.js'

run(QUnit, lib, lib, (stats) => {
  // @ts-ignore
  globalThis.stats = stats
})
