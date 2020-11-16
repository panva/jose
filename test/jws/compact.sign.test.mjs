/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jws/compact/sign`).then(
  ({ default: CompactSign }) => {
    test.before((t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.payload = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.secret = new Uint8Array(32);
    });

    test('CompactSign', async (t) => {
      const jws = await new CompactSign(t.context.payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(t.context.secret);
      t.is(
        jws,
        'eyJhbGciOiJIUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.UKohvCM6JaKEJlDt7ApBPgcQMW4lmp-UGXfwPmCfUaA',
      );
    });

    test('CompactSign.prototype.setProtectedHeader', (t) => {
      t.throws(
        () => new CompactSign(t.context.payload).setProtectedHeader({}).setProtectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setProtectedHeader can only be called once',
        },
      );
    });

    test('CompactSign.prototype.sign must have a JOSE header', async (t) => {
      await t.throwsAsync(new CompactSign(t.context.payload).sign(t.context.secret), {
        code: 'ERR_JWS_INVALID',
        message: 'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
      });
    });

    test('CompactSign.prototype.sign JOSE header have an alg', async (t) => {
      await t.throwsAsync(
        new CompactSign(t.context.payload).setProtectedHeader({}).sign(t.context.secret),
        {
          code: 'ERR_JWS_INVALID',
          message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
        },
      );
    });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
