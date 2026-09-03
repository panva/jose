import type QUnit from 'qunit'

import { ES256 } from '../src/algorithms/jws.js'
import { dir } from '../src/algorithms/jwe.js'
import { A256GCM } from '../src/algorithms/jwe/enc.js'
import { composeSignJWT } from '../src/composable/jwt/sign.js'
import { composeJwtVerify } from '../src/composable/jwt/verify.js'
import { composeEncryptJWT } from '../src/composable/jwt/encrypt.js'
import { composeJwtDecrypt } from '../src/composable/jwt/decrypt.js'

export default (QUnit: QUnit) => {
  QUnit.module('composable subpaths')

  QUnit.test('compose the existing JWT APIs from selected algorithms', (assert) => {
    const jws = ES256()
    const jwe = dir()
    const enc = A256GCM()

    assert.true(Object.isFrozen(jws))
    assert.true(Object.isFrozen(jwe))
    assert.true(Object.isFrozen(enc))
    assert.strictEqual(jws.algorithm, 'ES256')
    assert.strictEqual(jwe.algorithm, 'dir')
    assert.strictEqual(enc.algorithm, 'A256GCM')

    const SignJWT = composeSignJWT(ES256)
    const EncryptJWT = composeEncryptJWT(A256GCM, dir)
    assert.ok(new SignJWT({ sub: 'alice' }).setProtectedHeader({ alg: 'ES256' }))
    assert.ok(new EncryptJWT({ sub: 'alice' }).setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }))
    assert.strictEqual(typeof composeJwtVerify(ES256), 'function')
    assert.strictEqual(typeof composeJwtDecrypt(dir, A256GCM), 'function')
  })
}
