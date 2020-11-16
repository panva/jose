import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';

Promise.all([import(`${root}/jws/flattened/sign`), import(`${root}/jws/flattened/verify`)]).then(
  ([{ default: FlattenedSign }, { default: flattenedVerify }]) => {
    const encode = TextEncoder.prototype.encode.bind(new TextEncoder());

    test('JSON Web Signature (JWS) Unencoded Payload Option', async (t) => {
      const jws = await new FlattenedSign(encode('foo'))
        .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
        .sign(new Uint8Array(32));

      t.deepEqual(jws, {
        protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
        signature: 'VklKdp4tVYD61VNPDBTqxqdEQcUL3JK-D4dGXu9NvWs',
      });

      await t.notThrowsAsync(flattenedVerify({ ...jws, payload: 'foo' }, new Uint8Array(32)));
      await t.notThrowsAsync(
        flattenedVerify({ ...jws, payload: encode('foo') }, new Uint8Array(32)),
      );
    });

    test('b64 check', async (t) => {
      await t.throwsAsync(
        new FlattenedSign(encode('foo'))
          .setProtectedHeader({ alg: 'HS256', b64: null, crit: ['b64'] })
          .sign(new Uint8Array(32)),
        {
          code: 'ERR_JWS_INVALID',
          message: 'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
        },
      );
      await t.throwsAsync(
        new FlattenedSign(encode('foo'))
          .setProtectedHeader({ alg: 'HS256', crit: ['b64'] })
          .sign(new Uint8Array(32)),
        { code: 'ERR_JWS_INVALID', message: 'Extension Header Parameter "b64" is missing' },
      );
      await t.throwsAsync(
        new FlattenedSign(encode('foo'))
          .setProtectedHeader({ alg: 'HS256', crit: ['b64'] })
          .setUnprotectedHeader({ b64: false })
          .sign(new Uint8Array(32)),
        {
          code: 'ERR_JWS_INVALID',
          message: 'Extension Header Parameter "b64" MUST be integrity protected',
        },
      );
    });
  },
);
