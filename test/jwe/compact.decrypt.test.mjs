/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jwe/compact/decrypt`).then(
  ({ default: flattenedDecrypt }) => {
    test('JWE format validation', async (t) => {
      await t.throwsAsync(flattenedDecrypt(null, new Uint8Array()), {
        message: 'Compact JWE must be a string or Uint8Array',
        code: 'ERR_JWE_INVALID',
      });
      await t.throwsAsync(flattenedDecrypt('...', new Uint8Array()), {
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
