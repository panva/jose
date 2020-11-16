import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/lib/decrypt_key_management`),
  import(`${root}/util/generate_key_pair`),
]).then(
  ([{ default: decryptKeyManagement }, { default: generateKeyPair }]) => {
    test('lib/decrypt_key_management.ts', async (t) => {
      await t.throwsAsync(decryptKeyManagement('foo'), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'unsupported or invalid "alg" (JWE Algorithm) header value',
      });
    });

    test('ECDH-ES + KW requires epk', async (t) => {
      await t.throwsAsync(decryptKeyManagement('ECDH-ES+A128KW', undefined, undefined, {}), {
        code: 'ERR_JWE_INVALID',
        message: 'JOSE Header Ephemeral Public Key (epk) missing',
      });
    });

    test('ECDH-ES must not have an encrypted_key', async (t) => {
      await t.throwsAsync(decryptKeyManagement('ECDH-ES', undefined, new Uint8Array(), {}), {
        code: 'ERR_JWE_INVALID',
        message: 'Encountered unexpected JWE Encrypted Key',
      });
    });

    test('dir must not have an encrypted_key', async (t) => {
      await t.throwsAsync(decryptKeyManagement('dir', undefined, new Uint8Array(), {}), {
        code: 'ERR_JWE_INVALID',
        message: 'Encountered unexpected JWE Encrypted Key',
      });
    });

    test('PBES2 requires p2c', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('PBES2-HS256+A128KW', undefined, new Uint8Array(), { p2s: 'foo' }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header PBES2 Count (p2c) missing' },
      );
    });

    test('PBES2 requires p2s', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('PBES2-HS256+A128KW', undefined, new Uint8Array(), { p2c: 2000 }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header PBES2 Salt (p2s) missing' },
      );
    });

    test('GCM KW requires Authentication Tag', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('A128GCMKW', undefined, new Uint8Array(), { iv: 'foo' }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header Authentication Tag (tag) missing' },
      );
    });

    test('GCM KW requires Initialization Vector', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('A128GCMKW', undefined, new Uint8Array(), { tag: 'foo' }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header Initialization Vector (iv) missing' },
      );
    });

    for (const alg of ['RSA-OAEP', 'PBES2-HS256+A128KW', 'A128KW', 'A128GCMKW']) {
      test(`${alg} requires encrypted key`, async (t) => {
        await t.throwsAsync(decryptKeyManagement(alg, undefined, undefined), {
          code: 'ERR_JWE_INVALID',
          message: 'JWE Encrypted Key missing',
        });
      });
    }

    let conditional;
    if ('WEBCRYPTO' in process.env) {
      conditional = test.failing;
    } else {
      conditional = test;
    }
    conditional('ECDH-ES cannot be executed with secp256k1', async (t) => {
      const { privateKey } = await generateKeyPair('ES256K');
      await t.throwsAsync(decryptKeyManagement('ECDH-ES', privateKey, undefined, { epk: {} }), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message:
          'ECDH-ES with the provided key is not allowed or not supported by your javascript runtime',
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
