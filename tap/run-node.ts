import QUnit from 'qunit'
import run from './run.js'
import type * as jose from '../src/index.js'

let lib: typeof jose
let keys: typeof jose

// @ts-ignore
switch ([...process.argv].reverse()[0]) {
  case '#dist':
    // @ts-ignore
    keys = lib = await import('#dist')
    break
  case '#dist/webapi':
    // @ts-ignore
    keys = lib = await import('#dist/webapi')
    break
  case '#dist/node-crypto-with-cryptokey': {
    // @ts-ignore
    lib = { ...(await import('#dist')) }
    // @ts-ignore
    keys = await import('#dist/webapi')
    break
  }
  case '#dist/webcrypto-with-keyobject': {
    // @ts-ignore
    lib = { ...(await import('#dist/webapi')) }
    // @ts-ignore
    keys = await import('#dist')
    break
  }
  default:
    throw new Error()
}

const stats: QUnit.DoneDetails = await new Promise((resolve) => {
  run(QUnit, lib, keys, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exitCode = 1
}
