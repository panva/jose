import * as Bowser from 'bowser';

import generateKeyPair from '../dist/browser/util/generate_key_pair';

const browser = Bowser.parse(window.navigator.userAgent);

const p521 = browser.engine.name !== 'WebKit';

QUnit.test('Generate PS256', async (assert) => {
  assert.ok(await generateKeyPair('PS256'));
});

QUnit.test('Generate PS384', async (assert) => {
  assert.ok(await generateKeyPair('PS384'));
});

QUnit.test('Generate PS512', async (assert) => {
  assert.ok(await generateKeyPair('PS512'));
});

QUnit.test('Generate RS256', async (assert) => {
  assert.ok(await generateKeyPair('RS256'));
});

QUnit.test('Generate RS384', async (assert) => {
  assert.ok(await generateKeyPair('RS384'));
});

QUnit.test('Generate RS512', async (assert) => {
  assert.ok(await generateKeyPair('RS512'));
});

QUnit.test('Generate ES256', async (assert) => {
  assert.ok(await generateKeyPair('ES256'));
});

QUnit.test('Generate ES384', async (assert) => {
  assert.ok(await generateKeyPair('ES384'));
});

if (p521) {
  QUnit.test('Generate ES512', async (assert) => {
    assert.ok(await generateKeyPair('ES512'));
  });
} else {
  QUnit.test('Generate ES512', async (assert) => {
    await assert.rejects(generateKeyPair('ES512'));
  });
}

QUnit.test('RSA-OAEP', async (assert) => {
  assert.ok(await generateKeyPair('RSA-OAEP'));
});

QUnit.test('RSA-OAEP-256', async (assert) => {
  assert.ok(await generateKeyPair('RSA-OAEP-256'));
});

QUnit.test('RSA-OAEP-384', async (assert) => {
  assert.ok(await generateKeyPair('RSA-OAEP-384'));
});

QUnit.test('RSA-OAEP-512', async (assert) => {
  assert.ok(await generateKeyPair('RSA-OAEP-512'));
});

QUnit.test('ECDH-ES crv: P-256', async (assert) => {
  assert.ok(await generateKeyPair('ECDH-ES', { crv: 'P-256' }));
});

QUnit.test('ECDH-ES crv: P-384', async (assert) => {
  assert.ok(await generateKeyPair('ECDH-ES', { crv: 'P-384' }));
});

if (p521) {
  QUnit.test('ECDH-ES crv: P-521', async (assert) => {
    assert.ok(await generateKeyPair('ECDH-ES', { crv: 'P-521' }));
  });
} else {
  QUnit.test('ECDH-ES crv: P-521', async (assert) => {
    await assert.rejects(generateKeyPair('ECDH-ES', { crv: 'P-521' }));
  });
}
