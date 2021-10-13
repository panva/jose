import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/lib/cek`)]).then(
  ([{ default: cek }]) => {
    test('lib/cek.ts', (t) => {
      t.throws(() => cek('foo'), {
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
