import * as Bowser from 'bowser';

import generateSecret from '../dist/browser/util/generate_secret';

const browser = Bowser.parse(window.navigator.userAgent);

const aes192 = browser.engine.name !== 'Blink';

QUnit.test('HS256', async (assert) => {
  assert.ok(await generateSecret('HS256'));
});

QUnit.test('HS384', async (assert) => {
  assert.ok(await generateSecret('HS384'));
});

QUnit.test('HS512', async (assert) => {
  assert.ok(await generateSecret('HS512'));
});

QUnit.test('A128CBC-HS256', async (assert) => {
  assert.ok(await generateSecret('A128CBC-HS256'));
});

QUnit.test('A192CBC-HS384', async (assert) => {
  assert.ok(await generateSecret('A192CBC-HS384'));
});

QUnit.test('A256CBC-HS512', async (assert) => {
  assert.ok(await generateSecret('A256CBC-HS512'));
});

QUnit.test('A128KW', async (assert) => {
  assert.ok(await generateSecret('A128KW'));
});

if (aes192) {
  QUnit.test('A192KW', async (assert) => {
    assert.ok(await generateSecret('A192KW'));
  });
} else {
  QUnit.test('A192KW', async (assert) => {
    await assert.rejects(generateSecret('A192KW'));
  });
}

QUnit.test('A256KW', async (assert) => {
  assert.ok(await generateSecret('A256KW'));
});

QUnit.test('A128GCMKW', async (assert) => {
  assert.ok(await generateSecret('A128GCMKW'));
});

if (aes192) {
  QUnit.test('A192GCMKW', async (assert) => {
    assert.ok(await generateSecret('A192GCMKW'));
  });
} else {
  QUnit.test('A192GCMKW', async (assert) => {
    await assert.rejects(generateSecret('A192GCMKW'));
  });
}

QUnit.test('A256GCMKW', async (assert) => {
  assert.ok(await generateSecret('A256GCMKW'));
});

QUnit.test('A128GCM', async (assert) => {
  assert.ok(await generateSecret('A128GCM'));
});

if (aes192) {
  QUnit.test('A192GCM', async (assert) => {
    assert.ok(await generateSecret('A192GCM'));
  });
} else {
  QUnit.test('A192GCM', async (assert) => {
    await assert.rejects(generateSecret('A192GCM'));
  });
}

QUnit.test('A256GCM', async (assert) => {
  assert.ok(await generateSecret('A256GCM'));
});
