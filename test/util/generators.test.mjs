import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/util/generate_key_pair`),
  import(`${root}/util/generate_secret`),
]).then(
  ([{ default: generateKeyPair }, { default: generateSecret }]) => {
    async function testKeyPair(t, alg, options) {
      return t.notThrowsAsync(async () => {
        const { privateKey, publicKey } = await generateKeyPair(alg, options);
        t.true('type' in privateKey);
        t.is(privateKey.type, 'private');
        t.true('type' in publicKey);
        t.is(publicKey.type, 'public');

        for (const key of [publicKey, privateKey]) {
          // Test CryptoKey curves are set properly
          if ('algorithm' in key) {
            if (key.algorithm.name === 'ECDH') {
              t.is(key.algorithm.namedCurve, (options && options.crv) || 'P-256');
            }

            switch (alg) {
              case 'ES256':
                t.is(key.algorithm.namedCurve, 'P-256');
                break;
              case 'ES348':
                t.is(key.algorithm.namedCurve, 'P-384');
                break;
              case 'ES512':
                t.is(key.algorithm.namedCurve, 'P-521');
                break;
            }
          }

          // Test OKP KeyObject types are set properly
          if (
            'asymmetricKeyType' in key &&
            key.asymmetricKeyType !== 'ec' &&
            key.asymmetricKeyType !== 'rsa'
          ) {
            t.is(key.asymmetricKeyType, (options && options.crv.toLowerCase()) || 'ed25519');
          }
        }
      });
    }
    testKeyPair.title = (title, alg) => `generate ${alg} key pair${title ? ` ${title}` : ''}`;

    test(testKeyPair, 'PS256');
    test(testKeyPair, 'PS384');
    test(testKeyPair, 'PS512');
    test(testKeyPair, 'RS256');
    test(testKeyPair, 'RS384');
    test(testKeyPair, 'RS512');
    test(testKeyPair, 'RSA-OAEP');
    test(testKeyPair, 'RSA-OAEP-256');
    test(testKeyPair, 'RSA-OAEP-384');
    test(testKeyPair, 'RSA-OAEP-512');
    test(testKeyPair, 'ES256');
    test(testKeyPair, 'ES384');
    test(testKeyPair, 'ES512');
    test(testKeyPair, 'ECDH-ES');
    test(testKeyPair, 'ECDH-ES+A128KW');
    test(testKeyPair, 'ECDH-ES+A192KW');
    test(testKeyPair, 'ECDH-ES+A256KW');

    for (const crv of ['P-256', 'P-384', 'P-521']) {
      test(`crv: ${crv}`, testKeyPair, 'ECDH-ES', { crv });
      test(`crv: ${crv}`, testKeyPair, 'ECDH-ES+A128KW', { crv });
      test(`crv: ${crv}`, testKeyPair, 'ECDH-ES+A192KW', { crv });
      test(`crv: ${crv}`, testKeyPair, 'ECDH-ES+A256KW', { crv });
    }

    let conditional;
    if ('WEBCRYPTO' in process.env) {
      conditional = test.failing;
    } else {
      conditional = test;
    }
    conditional(testKeyPair, 'EdDSA');
    conditional('crv: Ed25519', testKeyPair, 'EdDSA', { crv: 'Ed25519' });
    conditional('crv: Ed448', testKeyPair, 'EdDSA', { crv: 'Ed448' });
    conditional(testKeyPair, 'ES256K');
    conditional(testKeyPair, 'RSA1_5');
    for (const crv of ['X25519', 'X448']) {
      conditional(`crv: ${crv}`, testKeyPair, 'ECDH-ES', { crv });
      conditional(`crv: ${crv}`, testKeyPair, 'ECDH-ES+A128KW', { crv });
      conditional(`crv: ${crv}`, testKeyPair, 'ECDH-ES+A192KW', { crv });
      conditional(`crv: ${crv}`, testKeyPair, 'ECDH-ES+A256KW', { crv });
    }

    async function testSecret(t, alg, expectedLength) {
      return t.notThrowsAsync(async () => {
        const secret = await generateSecret(alg);

        if ('symmetricKeySize' in secret) {
          t.is(secret.symmetricKeySize, expectedLength >> 3);
          t.true('type' in secret);
          t.is(secret.type, 'secret');
        } else if ('algorithm' in secret) {
          t.is(secret.algorithm.length, expectedLength);
          t.true('type' in secret);
          t.is(secret.type, 'secret');
        } else if (secret instanceof Uint8Array) {
          t.is(secret.length, expectedLength >> 3);
        } else {
          t.fail('unexpected type returned');
        }
      });
    }
    testSecret.title = (title, alg) => `generate ${alg} secret${title ? ` ${title}` : ''}`;

    test(testSecret, 'HS256', 256);
    test(testSecret, 'HS384', 384);
    test(testSecret, 'HS512', 512);
    test(testSecret, 'A128CBC-HS256', 256);
    test(testSecret, 'A192CBC-HS384', 384);
    test(testSecret, 'A256CBC-HS512', 512);
    test(testSecret, 'A128KW', 128);
    test(testSecret, 'A192KW', 192);
    test(testSecret, 'A256KW', 256);
    test(testSecret, 'A128GCMKW', 128);
    test(testSecret, 'A192GCMKW', 192);
    test(testSecret, 'A256GCMKW', 256);
    test(testSecret, 'A128GCM', 128);
    test(testSecret, 'A192GCM', 192);
    test(testSecret, 'A256GCM', 256);
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
