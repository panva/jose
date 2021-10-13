import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jwe/compact/decrypt`).then(
  ({ compactDecrypt }) => {
    test('JWE format validation', async (t) => {
      await t.throwsAsync(compactDecrypt(null, new Uint8Array(0)), {
        message: 'Compact JWE must be a string or Uint8Array',
        code: 'ERR_JWE_INVALID',
      });
      await t.throwsAsync(compactDecrypt('...', new Uint8Array(0)), {
        message: 'Invalid Compact JWE',
        code: 'ERR_JWE_INVALID',
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
