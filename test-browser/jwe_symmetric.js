import * as Bowser from 'bowser';

import generateSecret from '../dist/browser/util/generate_secret';
import random from '../dist/browser/util/random';
import FlattenedEncrypt from '../dist/browser/jwe/flattened/encrypt';
import decryptFlattened from '../dist/browser/jwe/flattened/decrypt';

const browser = Bowser.parse(window.navigator.userAgent);

const aes192 = browser.engine.name !== 'Blink';

async function test(generate, { alg, enc }, assert) {
  const secretKey = await generate();

  const jwe = await new FlattenedEncrypt(random(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc })
    .setAdditionalAuthenticatedData(random(new Uint8Array(32)))
    .encrypt(secretKey);

  await decryptFlattened(jwe, secretKey);
  assert.ok(1);
}

QUnit.test(
  'A128CBC-HS256',
  test.bind(undefined, generateSecret.bind(undefined, 'A128CBC-HS256'), {
    alg: 'dir',
    enc: 'A128CBC-HS256',
  }),
);
QUnit.test(
  'A128GCM',
  test.bind(undefined, generateSecret.bind(undefined, 'A128GCM'), {
    alg: 'dir',
    enc: 'A128GCM',
  }),
);
if (aes192) {
  QUnit.test(
    'A192CBC-HS384',
    test.bind(undefined, generateSecret.bind(undefined, 'A192CBC-HS384'), {
      alg: 'dir',
      enc: 'A192CBC-HS384',
    }),
  );
} else {
  QUnit.test('A192CBC-HS384', async (assert) => {
    await assert.rejects(
      test.bind(undefined, generateSecret.bind(undefined, 'A192CBC-HS384'), {
        alg: 'dir',
        enc: 'A192CBC-HS384',
      })(assert),
    );
  });
}
if (aes192) {
  QUnit.test(
    'A192GCM',
    test.bind(undefined, generateSecret.bind(undefined, 'A192GCM'), {
      alg: 'dir',
      enc: 'A192GCM',
    }),
  );
} else {
  QUnit.test('A192GCM', async (assert) => {
    await assert.rejects(
      test.bind(undefined, generateSecret.bind(undefined, 'A192GCM'), {
        alg: 'dir',
        enc: 'A192GCM',
      })(assert),
    );
  });
}
QUnit.test(
  'A256CBC-HS512',
  test.bind(undefined, generateSecret.bind(undefined, 'A256CBC-HS512'), {
    alg: 'dir',
    enc: 'A256CBC-HS512',
  }),
);
QUnit.test(
  'A256GCM',
  test.bind(undefined, generateSecret.bind(undefined, 'A256GCM'), {
    alg: 'dir',
    enc: 'A256GCM',
  }),
);

QUnit.test(
  'A128GCMKW',
  test.bind(undefined, generateSecret.bind(undefined, 'A128GCMKW'), {
    alg: 'A128GCMKW',
    enc: 'A256GCM',
  }),
);
QUnit.test(
  'A128KW',
  test.bind(undefined, generateSecret.bind(undefined, 'A128KW'), {
    alg: 'A128KW',
    enc: 'A256GCM',
  }),
);
if (aes192) {
  QUnit.test(
    'A192GCMKW',
    test.bind(undefined, generateSecret.bind(undefined, 'A192GCMKW'), {
      alg: 'A192GCMKW',
      enc: 'A256GCM',
    }),
  );
} else {
  QUnit.test('A192GCMKW', async (assert) => {
    await assert.rejects(
      test.bind(undefined, generateSecret.bind(undefined, 'A192GCMKW'), {
        alg: 'A192GCMKW',
        enc: 'A256GCM',
      })(assert),
    );
  });
}
if (aes192) {
  QUnit.test(
    'A192KW',
    test.bind(undefined, generateSecret.bind(undefined, 'A192KW'), {
      alg: 'A192KW',
      enc: 'A256GCM',
    }),
  );
} else {
  QUnit.test('A192KW', async (assert) => {
    await assert.rejects(
      test.bind(undefined, generateSecret.bind(undefined, 'A192KW'), {
        alg: 'A192KW',
        enc: 'A256GCM',
      })(assert),
    );
  });
}
QUnit.test(
  'A256GCMKW',
  test.bind(undefined, generateSecret.bind(undefined, 'A256GCMKW'), {
    alg: 'A256GCMKW',
    enc: 'A256GCM',
  }),
);
QUnit.test(
  'A256KW',
  test.bind(undefined, generateSecret.bind(undefined, 'A256KW'), {
    alg: 'A256KW',
    enc: 'A256GCM',
  }),
);

QUnit.test(
  'PBES2-HS256+A128KW',
  test.bind(undefined, () => random(new Uint8Array(10)), {
    alg: 'PBES2-HS256+A128KW',
    enc: 'A256GCM',
  }),
);
if (aes192) {
  QUnit.test(
    'PBES2-HS384+A192KW',
    test.bind(undefined, () => random(new Uint8Array(10)), {
      alg: 'PBES2-HS384+A192KW',
      enc: 'A256GCM',
    }),
  );
} else {
  QUnit.test('PBES2-HS384+A192KW', async (assert) => {
    await assert.rejects(
      test.bind(undefined, () => random(new Uint8Array(10)), {
        alg: 'PBES2-HS384+A192KW',
        enc: 'A256GCM',
      })(assert),
    );
  });
}
QUnit.test(
  'PBES2-HS512+A256KW',
  test.bind(undefined, () => random(new Uint8Array(10)), {
    alg: 'PBES2-HS512+A256KW',
    enc: 'A256GCM',
  }),
);
