import * as Bowser from 'bowser';

import generateKeyPair from '../dist/browser/util/generate_key_pair';
import random from '../dist/browser/util/random';
import FlattenedEncrypt from '../dist/browser/jwe/flattened/encrypt';
import decryptFlattened from '../dist/browser/jwe/flattened/decrypt';

const browser = Bowser.parse(window.navigator.userAgent);

const p521 = browser.engine.name !== 'WebKit';

async function test(generate, alg, assert) {
  const { publicKey, privateKey } = await generate();

  const jwe = await new FlattenedEncrypt(random(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(random(new Uint8Array(32)))
    .encrypt(publicKey);

  await decryptFlattened(jwe, privateKey);
  assert.ok(1);
}

// eslint-disable-next-line no-restricted-syntax
for (const crv of ['P-256', 'P-384', 'P-521']) {
  if (crv === 'P-521' && !p521) {
    QUnit.test(`ECDH-ES crv: ${crv}`, async (assert) => {
      await assert.rejects(
        test.bind(
          undefined,
          generateKeyPair.bind(undefined, 'ECDH-ES', { crv }),
          'ECDH-ES',
        )(assert),
      );
    });
  } else {
    QUnit.test(
      `ECDH-ES crv: ${crv}`,
      test.bind(undefined, generateKeyPair.bind(undefined, 'ECDH-ES', { crv }), 'ECDH-ES'),
    );
  }
}

QUnit.test(
  'RSA-OAEP-256',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-256'), 'RSA-OAEP-256'),
);
QUnit.test(
  'RSA-OAEP-384',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-384'), 'RSA-OAEP-384'),
);
QUnit.test(
  'RSA-OAEP-512',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-512'), 'RSA-OAEP-512'),
);
QUnit.test(
  'RSA-OAEP',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP'), 'RSA-OAEP'),
);
