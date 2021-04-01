import test from 'ava';

let root;
let keyRoot;

if ('WEBCRYPTO' in process.env) {
  root = keyRoot = '#dist/webcrypto';
} else if ('CRYPTOKEY' in process.env) {
  root = '#dist';
  keyRoot = '#dist/webcrypto';
} else {
  root = keyRoot = '#dist';
}

Promise.all([
  import(`${root}/lib/decrypt_key_management`),
  import(`${keyRoot}/util/generate_key_pair`),
  import(`${keyRoot}/jwk/parse`),
]).then(
  ([{ default: decryptKeyManagement }, { default: generateKeyPair }, { default: parseJwk }]) => {
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
      await t.throwsAsync(decryptKeyManagement('ECDH-ES', undefined, new Uint8Array(0), {}), {
        code: 'ERR_JWE_INVALID',
        message: 'Encountered unexpected JWE Encrypted Key',
      });
    });

    test('dir must not have an encrypted_key', async (t) => {
      await t.throwsAsync(decryptKeyManagement('dir', undefined, new Uint8Array(0), {}), {
        code: 'ERR_JWE_INVALID',
        message: 'Encountered unexpected JWE Encrypted Key',
      });
    });

    test('PBES2 requires p2c', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('PBES2-HS256+A128KW', undefined, new Uint8Array(0), { p2s: 'foo' }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header PBES2 Count (p2c) missing' },
      );
    });

    test('PBES2 requires p2s', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('PBES2-HS256+A128KW', undefined, new Uint8Array(0), { p2c: 2000 }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header PBES2 Salt (p2s) missing' },
      );
    });

    test('GCM KW requires Authentication Tag', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('A128GCMKW', undefined, new Uint8Array(0), { iv: 'foo' }),
        { code: 'ERR_JWE_INVALID', message: 'JOSE Header Authentication Tag (tag) missing' },
      );
    });

    test('GCM KW requires Initialization Vector', async (t) => {
      await t.throwsAsync(
        decryptKeyManagement('A128GCMKW', undefined, new Uint8Array(0), { tag: 'foo' }),
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

    function conditional({ webcrypto = 1, electron = 1 } = {}, ...args) {
      let run = test;
      if ((!webcrypto && 'WEBCRYPTO' in process.env) || 'CRYPTOKEY' in process.env) {
        run = run.failing;
      }

      if (!electron && 'electron' in process.versions) {
        run = run.failing;
      }
      return run;
    }

    conditional({ webcrypto: 0, electron: 0 })(
      'ECDH-ES cannot be executed with secp256k1',
      async (t) => {
        const { privateKey } = await generateKeyPair('ES256K');
        await t.throwsAsync(decryptKeyManagement('ECDH-ES', privateKey, undefined, { epk: {} }), {
          code: 'ERR_JOSE_NOT_SUPPORTED',
          message:
            'ECDH-ES with the provided key is not allowed or not supported by your javascript runtime',
        });
      },
    );

    conditional({ webcrypto: 0 })('RFC8037 - A.6. ECDH-ES with X25519', async (t) => {
      const privateKey = await parseJwk(
        {
          kty: 'OKP',
          crv: 'X25519',
          x: 'hSDwCYkwp1R0i33ctD73Wg2_Og0mOBr066SpjqqbTmo',
          d: 'dwdtCnMYpX08FsFyUbJmRd9ML4frwJkqsXf7pR25LCo',
        },
        'ECDH-ES',
      );

      const keyManagement = await decryptKeyManagement('ECDH-ES', privateKey, undefined, {
        alg: 'ECDH-ES',
        enc: 'A256GCM',
        epk: {
          kty: 'OKP',
          crv: 'X25519',
          x: '3p7bfXt9wbTTW2HC7OQ1Nz-DQ8hbeGdNrfx-FG-IK08',
        },
      });

      t.deepEqual(
        keyManagement,
        Buffer.from('d3f1a933aa331e5d3204beab09cddb96dbdaba47a555530b70fa4af7187c6edd', 'hex'),
      );
    });

    conditional({ webcrypto: 0, electron: 0 })('RFC8037 - A.6. ECDH-ES with X448', async (t) => {
      const privateKey = await parseJwk(
        {
          kty: 'OKP',
          crv: 'X448',
          x: 'mwj3zDG34-Z9ItWuoSEHSic70rg94Jxj-qc9LCLF2bvINmRyQdlT1AxbEtqIEg1TF3-A5TLEH6A',
          d: 'mo9JJdFRn1d1z0awS1gA1O6e6LrovFVl1JjCjdnJuvV0qUGXRIlzkQBjgqbxJ6sdmsLYwKWYcms',
        },
        'ECDH-ES',
      );

      const keyManagement = await decryptKeyManagement('ECDH-ES', privateKey, undefined, {
        alg: 'ECDH-ES',
        enc: 'A256GCM',
        epk: {
          kty: 'OKP',
          crv: 'X448',
          x: 'PreoKbDNIPW8_AtZm2_sz22kYnEHvbDU80W0MCfYuXL8PjT7QjKhPKcG3LV67D2uB73BxnvzNgk',
        },
      });

      t.deepEqual(
        keyManagement,
        Buffer.from('5171b73b1b4a7ef896ef4cb1775da5db6256dc885f260a0ae3bbe0632420bf7c', 'hex'),
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
