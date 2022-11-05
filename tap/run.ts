import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

export default async (
  QUnit: QUnit,
  lib: typeof jose,
  done: (details: QUnit.DoneDetails) => void,
) => {
  // @ts-ignore
  QUnit.reporters.tap.init(QUnit)
  QUnit.config.autostart = false

  const modules = await Promise.all([
    import('./aes.js'),
    import('./aeskw.js'),
    import('./cookbook.js'),
    import('./ecdh.js'),
    import('./hmac.js'),
    import('./jwk.js'),
    import('./jwks.js'),
    import('./jws.js'),
    import('./pem.js'),
    import('./pbes2.js'),
    import('./rsaes.js'),
  ])
  for (const { default: module } of modules) {
    await module(QUnit, lib)
  }
  QUnit.start()
  QUnit.done(done)
}
