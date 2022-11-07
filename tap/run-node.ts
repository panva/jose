import QUnit from 'qunit'
import run from './run.js'
import type * as jose from '../src/index.js'

let lib: typeof jose

// @ts-ignore
switch ([...process.argv].reverse()[0]) {
  case '#dist':
    // @ts-ignore
    lib = await import('#dist')
    break
  case '#dist/webapi':
    // @ts-ignore
    lib = await import('#dist/webapi')
    break
  case '#dist/hybrid':
    // @ts-ignore
    lib = { ...(await import('#dist')) }
    // @ts-ignore
    const keys = await import('#dist/webapi')

    Object.assign(lib, {
      exportJWK: keys.exportJWK,
      exportPKCS8: keys.exportPKCS8,
      exportSPKI: keys.exportSPKI,
      generateKeyPair: keys.generateKeyPair,
      generateSecret: keys.generateSecret,
      importJWK: keys.importJWK,
      importPKCS8: keys.importPKCS8,
      importSPKI: keys.importSPKI,
      importX509: keys.importX509,
    })
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
