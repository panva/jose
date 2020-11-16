import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';

Promise.all([import(`${root}/jws/flattened/sign`), import(`${root}/jws/flattened/verify`)]).then(
  ([{ default: FlattenedSign }, { default: flattenedVerify }]) => {
    const encode = TextEncoder.prototype.encode.bind(new TextEncoder());

    test('crit member checks check', async (t) => {
      await t.throwsAsync(
        new FlattenedSign(encode('foo'))
          .setProtectedHeader({ alg: 'HS256' })
          .setUnprotectedHeader({ crit: ['b64'] })
          .sign(new Uint8Array(32)),
        {
          code: 'ERR_JWS_INVALID',
          message: '"crit" (Critical) Header Parameter MUST be integrity protected',
        },
      );
      await t.throwsAsync(
        new FlattenedSign(encode('foo'))
          .setProtectedHeader({ alg: 'HS256', crit: [null], b64: false })
          .sign(new Uint8Array(32)),
        {
          code: 'ERR_JWS_INVALID',
          message:
            '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
        },
      );
      await t.throwsAsync(
        new FlattenedSign(encode('foo'))
          .setProtectedHeader({ alg: 'HS256', crit: ['unsupported'], unsupported: 'foo' })
          .sign(new Uint8Array(32)),
        {
          code: 'ERR_JOSE_NOT_SUPPORTED',
          message:
            'Extension Header Parameter "unsupported" is not supported by this implementation',
        },
      );
    });
  },
);
