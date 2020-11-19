/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jws/compact/verify`).then(
  ({ default: flattenedVerify }) => {
    test('JWS format validation', async (t) => {
      await t.throwsAsync(flattenedVerify(null, new Uint8Array()), {
        message: 'Compact JWS must be a string or Uint8Array',
        code: 'ERR_JWS_INVALID',
      });
      await t.throwsAsync(flattenedVerify('.....', new Uint8Array()), {
        message: 'Invalid Compact JWS',
        code: 'ERR_JWS_INVALID',
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
