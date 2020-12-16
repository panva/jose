/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jws/flattened/sign`),
  import(`${root}/jws/general/verify`),
  import(`${root}/util/random`),
]).then(
  ([{ default: FlattenedSign }, { default: generalVerify }, { default: random }]) => {
    test.before(async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.secret = random(new Uint8Array(32));
    });

    test('JWS format validation', async (t) => {
      const flattenedJws = await new FlattenedSign(t.context.plaintext)
        .setProtectedHeader({ bar: 'baz' })
        .setUnprotectedHeader({ alg: 'HS256' })
        .sign(t.context.secret);

      {
        await t.throwsAsync(generalVerify(null, t.context.secret), {
          message: 'General JWS must be an object',
          code: 'ERR_JWS_INVALID',
        });
      }

      {
        await t.throwsAsync(generalVerify({ signatures: null }, t.context.secret), {
          message: 'JWS Signatures missing or incorrect type',
          code: 'ERR_JWS_INVALID',
        });
      }

      {
        await t.throwsAsync(generalVerify({ signatures: [null] }, t.context.secret), {
          message: 'JWS Signatures missing or incorrect type',
          code: 'ERR_JWS_INVALID',
        });
      }

      {
        const jws = { payload: flattenedJws.payload, signatures: [] };

        await t.throwsAsync(generalVerify(jws, t.context.secret), {
          message: 'signature verification failed',
          code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
        });
      }

      {
        const { payload, ...signature } = flattenedJws;
        const jws = { payload, signatures: [signature] };

        await t.notThrowsAsync(generalVerify(jws, t.context.secret));
      }

      {
        const { payload, ...signature } = flattenedJws;
        const jws = { payload, signatures: [signature, {}] };

        await t.notThrowsAsync(generalVerify(jws, t.context.secret));
      }

      {
        const { payload, ...signature } = flattenedJws;
        const jws = { payload, signatures: [{}, signature] };

        await t.notThrowsAsync(generalVerify(jws, t.context.secret));
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
