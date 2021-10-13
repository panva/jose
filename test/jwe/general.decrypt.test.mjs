import test from 'ava';
import * as crypto from 'crypto';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/jwe/flattened/encrypt`), import(`${root}/jwe/general/decrypt`)]).then(
  ([{ default: FlattenedEncrypt }, { default: generalDecrypt }]) => {
    test.before(async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.additionalAuthenticatedData = encode('The Fellowship of the Ring');
      t.context.initializationVector = crypto.randomFillSync(new Uint8Array(12));
      t.context.secret = crypto.randomFillSync(new Uint8Array(16));
    });

    test('JWS format validation', async (t) => {
      const flattenedJwe = await new FlattenedEncrypt(t.context.plaintext)
        .setProtectedHeader({ bar: 'baz' })
        .setUnprotectedHeader({ foo: 'bar' })
        .setSharedUnprotectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
        .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
        .encrypt(t.context.secret);

      const generalJwe = {
        aad: flattenedJwe.aad,
        ciphertext: flattenedJwe.ciphertext,
        iv: flattenedJwe.iv,
        protected: flattenedJwe.protected,
        tag: flattenedJwe.tag,
        unprotected: flattenedJwe.unprotected,
        recipients: [
          {
            encrypted_key: flattenedJwe.encrypted_key,
            header: flattenedJwe.header,
          },
        ],
      };

      {
        await t.throwsAsync(generalDecrypt(null, t.context.secret), {
          message: 'General JWE must be an object',
          code: 'ERR_JWE_INVALID',
        });
      }

      {
        await t.throwsAsync(generalDecrypt({ recipients: null }, t.context.secret), {
          message: 'JWE Recipients missing or incorrect type',
          code: 'ERR_JWE_INVALID',
        });
      }

      {
        await t.throwsAsync(generalDecrypt({ recipients: [null] }, t.context.secret), {
          message: 'JWE Recipients missing or incorrect type',
          code: 'ERR_JWE_INVALID',
        });
      }

      {
        const jwe = { ...generalJwe, recipients: [] };

        await t.throwsAsync(generalDecrypt(jwe, t.context.secret), {
          message: 'decryption operation failed',
          code: 'ERR_JWE_DECRYPTION_FAILED',
        });
      }

      {
        const jwe = { ...generalJwe, recipients: [generalJwe.recipients[0]] };

        await t.notThrowsAsync(generalDecrypt(jwe, t.context.secret));
      }

      {
        const jwe = { ...generalJwe, recipients: [generalJwe.recipients[0], {}] };

        await t.notThrowsAsync(generalDecrypt(jwe, t.context.secret));
      }

      {
        const jwe = { ...generalJwe, recipients: [{}, generalJwe.recipients[0]] };

        await t.notThrowsAsync(generalDecrypt(jwe, t.context.secret));
      }
    });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
