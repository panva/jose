import * as Bowser from 'bowser';

import generateKeyPair from '../dist/browser/util/generate_key_pair';
import generateSecret from '../dist/browser/util/generate_secret';
import random from '../dist/browser/util/random';
import FlattenedSign from '../dist/browser/jws/flattened/sign';
import verifyFlattened from '../dist/browser/jws/flattened/verify';

const browser = Bowser.parse(window.navigator.userAgent);

const p521 = browser.engine.name !== 'WebKit';

async function test(generate, alg, assert) {
  const generated = await generate();
  let privateKey;
  let publicKey;
  if (generated.type === 'secret') {
    publicKey = privateKey = generated;
  } else {
    ({ publicKey, privateKey } = generated);
  }

  const jws = await new FlattenedSign(random(new Uint8Array(32)))
    .setProtectedHeader({ alg })
    .sign(privateKey);

  await verifyFlattened(jws, publicKey);
  assert.ok(1);
}

QUnit.test('HS256', test.bind(undefined, generateSecret.bind(undefined, 'HS256'), 'HS256'));
QUnit.test('HS384', test.bind(undefined, generateSecret.bind(undefined, 'HS384'), 'HS384'));
QUnit.test('HS512', test.bind(undefined, generateSecret.bind(undefined, 'HS512'), 'HS512'));
QUnit.test('ES256', test.bind(undefined, generateKeyPair.bind(undefined, 'ES256'), 'ES256'));
QUnit.test('ES384', test.bind(undefined, generateKeyPair.bind(undefined, 'ES384'), 'ES384'));
if (p521) {
  QUnit.test('ES512', test.bind(undefined, generateKeyPair.bind(undefined, 'ES512'), 'ES512'));
} else {
  QUnit.test('ES512', async (assert) => {
    await assert.rejects(
      test.bind(undefined, generateKeyPair.bind(undefined, 'ES512'), 'ES512')(assert),
    );
  });
}
QUnit.test('PS256', test.bind(undefined, generateKeyPair.bind(undefined, 'PS256'), 'PS256'));
QUnit.test('PS384', test.bind(undefined, generateKeyPair.bind(undefined, 'PS384'), 'PS384'));
QUnit.test('PS512', test.bind(undefined, generateKeyPair.bind(undefined, 'PS512'), 'PS512'));
QUnit.test('RS256', test.bind(undefined, generateKeyPair.bind(undefined, 'RS256'), 'RS256'));
QUnit.test('RS384', test.bind(undefined, generateKeyPair.bind(undefined, 'RS384'), 'RS384'));
QUnit.test('RS512', test.bind(undefined, generateKeyPair.bind(undefined, 'RS512'), 'RS512'));
