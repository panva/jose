/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jws/general/sign`),
  import(`${root}/jws/general/verify`),
  import(`${root}/util/random`),
]).then(
  ([{ default: GeneralSign }, { default: generalVerify }, { default: random }]) => {
    test.before(async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.secret = random(new Uint8Array(48));
    });

    test('General JWS signing', async (t) => {
      const sig = new GeneralSign(t.context.plaintext);

      sig
        .addSignature(t.context.secret)
        .setProtectedHeader({ bar: 'baz' })
        .setUnprotectedHeader({ alg: 'HS256' });

      sig
        .addSignature(t.context.secret)
        .setProtectedHeader({ bar: 'baz' })
        .setUnprotectedHeader({ alg: 'HS384' });

      const generalJws = await sig.sign();

      t.is(
        generalJws.payload,
        'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
      );
      t.is(generalJws.signatures.length, 2);
    });

    test('General JWS signing b64:false', async (t) => {
      const sig = new GeneralSign(t.context.plaintext);

      sig
        .addSignature(t.context.secret)
        .setProtectedHeader({ bar: 'baz', b64: false, crit: ['b64'] })
        .setUnprotectedHeader({ alg: 'HS256' });

      sig
        .addSignature(t.context.secret)
        .setProtectedHeader({ bar: 'baz', b64: false, crit: ['b64'] })
        .setUnprotectedHeader({ alg: 'HS384' });

      const generalJws = await sig.sign();

      t.false('payload' in generalJws);
      t.is(generalJws.signatures.length, 2);
    });

    test('General JWS signing validations', async (t) => {
      const sig = new GeneralSign(t.context.plaintext);

      t.throws(
        () => {
          sig
            .addSignature(t.context.secret)
            .setProtectedHeader({ bar: 'baz', crit: ['b64'], b64: false, alg: 'HS256' })
            .setProtectedHeader({ bar: 'baz', crit: ['b64'], b64: false, alg: 'HS256' });
        },
        { instanceOf: TypeError, message: 'setProtectedHeader can only be called once' },
      );

      t.throws(
        () => {
          sig
            .addSignature(t.context.secret)
            .setProtectedHeader({ bar: 'baz', crit: ['b64'], b64: true, alg: 'HS384' })
            .setUnprotectedHeader({ foo: 'bar' })
            .setUnprotectedHeader({ foo: 'bar' });
        },
        { instanceOf: TypeError, message: 'setUnprotectedHeader can only be called once' },
      );

      await t.throwsAsync(sig.sign(), {
        message: 'index 1 signature produced a different payload',
        code: 'ERR_JWS_INVALID',
      });
    });

    test('General JWS verify format validation', async (t) => {
      const sig = new GeneralSign(t.context.plaintext);

      sig
        .addSignature(t.context.secret)
        .setProtectedHeader({ bar: 'baz' })
        .setUnprotectedHeader({ alg: 'HS256' });

      const generalJws = await sig.sign();

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
        const jws = { payload: generalJws.payload, signatures: [] };

        await t.throwsAsync(generalVerify(jws, t.context.secret), {
          message: 'signature verification failed',
          code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
        });
      }

      {
        await t.notThrowsAsync(generalVerify(generalJws, t.context.secret));
      }

      {
        const { payload, signatures } = generalJws;
        const jws = { payload, signatures: [...signatures, {}] };

        await t.notThrowsAsync(generalVerify(jws, t.context.secret));
      }

      {
        const { payload, signatures } = generalJws;
        const jws = { payload, signatures: [{}, ...signatures] };

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
