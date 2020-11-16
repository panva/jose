import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/lib/cek`), import(`${root}/util/random`)]).then(
  ([{ default: cek }, { default: random }]) => {
    test('lib/cek.ts', (t) => {
      t.throws(() => cek(random)('foo'), {
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
