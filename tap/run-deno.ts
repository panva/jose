import '../node_modules/qunit/qunit/qunit.js'
import run from './run.js'
import * as lib from '../src/index.js'

run(QUnit, lib, lib, (stats) => {
  if (stats?.failed !== 0) {
    // @ts-ignore
    Deno.exit(1)
  }
})
