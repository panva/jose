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
  import(`${root}/lib/encrypt_key_management`),
  import(`${keyRoot}/util/generate_key_pair`),
  import(`${keyRoot}/jwk/parse`),
]).then(
  ([{ default: encryptKeyManagement }, { default: generateKeyPair }, { default: parseJwk }]) => {
    test('lib/encrypt_key_management.ts', async (t) => {
      await t.throwsAsync(encryptKeyManagement('foo'), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'unsupported or invalid "alg" (JWE Algorithm) header value',
      });
    });

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
        const { publicKey } = await generateKeyPair('ES256K');
        await t.throwsAsync(encryptKeyManagement('ECDH-ES', 'A128GCM', publicKey), {
          code: 'ERR_JOSE_NOT_SUPPORTED',
          message:
            'ECDH-ES with the provided key is not allowed or not supported by your javascript runtime',
        });
      },
    );

    conditional({ webcrypto: 0 })('RFC8037 - A.6. ECDH-ES with X25519', async (t) => {
      const [publicKey, ephemeral] = await Promise.all([
        parseJwk(
          {
            kty: 'OKP',
            crv: 'X25519',
            x: '3p7bfXt9wbTTW2HC7OQ1Nz-DQ8hbeGdNrfx-FG-IK08',
          },
          'ECDH-ES',
        ),
        parseJwk(
          {
            kty: 'OKP',
            crv: 'X25519',
            x: 'hSDwCYkwp1R0i33ctD73Wg2_Og0mOBr066SpjqqbTmo',
            d: 'dwdtCnMYpX08FsFyUbJmRd9ML4frwJkqsXf7pR25LCo',
          },
          'ECDH-ES',
        ),
      ]);

      const keyManagement = await encryptKeyManagement('ECDH-ES', 'A256GCM', publicKey, undefined, {
        epk: ephemeral,
      });

      t.deepEqual(keyManagement, {
        encryptedKey: undefined,
        parameters: {
          epk: {
            x: 'hSDwCYkwp1R0i33ctD73Wg2_Og0mOBr066SpjqqbTmo',
            y: undefined,
            crv: 'X25519',
            kty: 'OKP',
          },
        },
        cek: Buffer.from('d3f1a933aa331e5d3204beab09cddb96dbdaba47a555530b70fa4af7187c6edd', 'hex'),
      });
    });

    conditional({ webcrypto: 0, electron: 0 })('RFC8037 - A.6. ECDH-ES with X448', async (t) => {
      const [publicKey, ephemeral] = await Promise.all([
        parseJwk(
          {
            kty: 'OKP',
            crv: 'X448',
            x: 'PreoKbDNIPW8_AtZm2_sz22kYnEHvbDU80W0MCfYuXL8PjT7QjKhPKcG3LV67D2uB73BxnvzNgk',
          },
          'ECDH-ES',
        ),
        parseJwk(
          {
            kty: 'OKP',
            crv: 'X448',
            x: 'mwj3zDG34-Z9ItWuoSEHSic70rg94Jxj-qc9LCLF2bvINmRyQdlT1AxbEtqIEg1TF3-A5TLEH6A',
            d: 'mo9JJdFRn1d1z0awS1gA1O6e6LrovFVl1JjCjdnJuvV0qUGXRIlzkQBjgqbxJ6sdmsLYwKWYcms',
          },
          'ECDH-ES',
        ),
      ]);

      const keyManagement = await encryptKeyManagement('ECDH-ES', 'A256GCM', publicKey, undefined, {
        epk: ephemeral,
      });

      t.deepEqual(keyManagement, {
        encryptedKey: undefined,
        parameters: {
          epk: {
            x: 'mwj3zDG34-Z9ItWuoSEHSic70rg94Jxj-qc9LCLF2bvINmRyQdlT1AxbEtqIEg1TF3-A5TLEH6A',
            y: undefined,
            crv: 'X448',
            kty: 'OKP',
          },
        },
        cek: Buffer.from('5171b73b1b4a7ef896ef4cb1775da5db6256dc885f260a0ae3bbe0632420bf7c', 'hex'),
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
