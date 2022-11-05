import 'qunit'
import run from './run.js'
// @ts-ignore
import * as lib from '#dist/webapi'

run(QUnit, lib, (stats) => {
  if (stats?.failed !== 0) {
    // @ts-ignore
    Deno.exit(1)
  }
})
