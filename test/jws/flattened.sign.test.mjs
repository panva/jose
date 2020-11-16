/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jws/flattened/sign`).then(
  ({ default: FlattenedSign }) => {
    test.before(async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.payload = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.secret = new Uint8Array(32);
    });

    test('FlattenedSign', async (t) => {
      {
        const jws = await new FlattenedSign(t.context.payload)
          .setProtectedHeader({ alg: 'HS256' })
          .setUnprotectedHeader({ foo: 'bar' })
          .sign(t.context.secret);
        t.deepEqual(jws, {
          header: {
            foo: 'bar',
          },
          payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
          protected: 'eyJhbGciOiJIUzI1NiJ9',
          signature: 'UKohvCM6JaKEJlDt7ApBPgcQMW4lmp-UGXfwPmCfUaA',
        });
      }
      {
        const jws = await new FlattenedSign(t.context.payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(t.context.secret);
        t.deepEqual(jws, {
          protected: 'eyJhbGciOiJIUzI1NiJ9',
          payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
          signature: 'UKohvCM6JaKEJlDt7ApBPgcQMW4lmp-UGXfwPmCfUaA',
        });
      }
      {
        const jws = await new FlattenedSign(t.context.payload)
          .setUnprotectedHeader({ alg: 'HS256' })
          .sign(t.context.secret);
        t.deepEqual(jws, {
          header: {
            alg: 'HS256',
          },
          payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
          signature: 'O7HdMZ_6_aEQWLGGItmCKN3pf8-nZ9mHnPfT7rrPCwk',
        });
      }
    });

    test('FlattenedSign.prototype.setProtectedHeader', (t) => {
      t.throws(
        () => new FlattenedSign(t.context.payload).setProtectedHeader({}).setProtectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setProtectedHeader can only be called once',
        },
      );
    });

    test('FlattenedSign.prototype.setUnprotectedHeader', (t) => {
      t.throws(
        () =>
          new FlattenedSign(t.context.payload).setUnprotectedHeader({}).setUnprotectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setUnprotectedHeader can only be called once',
        },
      );
    });

    test('FlattenedSign.prototype.sign must have a JOSE header', async (t) => {
      await t.throwsAsync(new FlattenedSign(t.context.payload).sign(t.context.secret), {
        code: 'ERR_JWS_INVALID',
        message: 'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
      });
    });

    test('FlattenedSign.prototype.sign JOSE header must be disjoint', async (t) => {
      await t.throwsAsync(
        new FlattenedSign(t.context.payload)
          .setProtectedHeader({ alg: 'HS256' })
          .setUnprotectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
        {
          code: 'ERR_JWS_INVALID',
          message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
        },
      );
    });

    test('FlattenedSign.prototype.sign JOSE header have an alg', async (t) => {
      await t.throwsAsync(
        new FlattenedSign(t.context.payload)
          .setProtectedHeader({})
          .setUnprotectedHeader({})
          .sign(t.context.secret),
        {
          code: 'ERR_JWS_INVALID',
          message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
        },
      );
      await t.notThrowsAsync(
        new FlattenedSign(t.context.payload)
          .setProtectedHeader({ alg: 'HS256' })
          .setUnprotectedHeader({ foo: 'bar' })
          .sign(t.context.secret),
      );
      await t.notThrowsAsync(
        new FlattenedSign(t.context.payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
      );
      await t.notThrowsAsync(
        new FlattenedSign(t.context.payload)
          .setProtectedHeader({ foo: 'bar' })
          .setUnprotectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
      );
      await t.notThrowsAsync(
        new FlattenedSign(t.context.payload)
          .setUnprotectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
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
