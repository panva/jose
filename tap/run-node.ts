import QUnit from 'qunit'
import run from './run.js'
import type * as jose from '../src/index.js'

let lib: typeof jose

// @ts-ignore
switch (process.argv.at(-1)) {
  case '#dist':
    // @ts-ignore
    lib = await import('#dist')
    break
  case '#dist/webapi':
    // @ts-ignore
    lib = await import('#dist/webapi')
    break
  default:
    throw new Error()
}

const stats: QUnit.DoneDetails = await new Promise((resolve) => {
  run(QUnit, lib, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exitCode = 1
}
