import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/lib/check_iv_length`).then(
  ({ default: checkIvLength }) => {
    test('lib/check_iv_length.ts', (t) => {
      t.throws(() => checkIvLength('A256GCM', new Uint8Array(13)), {
        code: 'ERR_JWE_INVALID',
        message: 'Invalid Initialization Vector length',
      });
      t.notThrows(() => checkIvLength('A256GCM', new Uint8Array(12)));
    });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
