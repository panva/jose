import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/lib/iv`), import(`${root}/util/random`)]).then(
  ([{ default: iv }, { default: random }]) => {
    test('lib/iv.ts', (t) => {
      t.throws(() => iv(random)('foo'), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'Unsupported JWE Algorithm: foo',
      });
    });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
