/* eslint-disable no-param-reassign */
import test from 'ava';
import timekeeper from 'timekeeper';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/jwt/encrypt`), import(`${root}/jwe/compact/decrypt`)]).then(
  ([{ default: EncryptJWT }, { default: compactDecrypt }]) => {
    const now = 1604416038;

    test.before(async (t) => {
      t.context.secret = new Uint8Array(16);
      t.context.initializationVector = new Uint8Array(12);
      t.context.payload = { 'urn:example:claim': true };

      timekeeper.freeze(new Date(now * 1000));
    });

    test.after(timekeeper.reset);

    test('EncryptJWT', async (t) => {
      const jwt = await new EncryptJWT(t.context.payload)
        .setInitializationVector(t.context.initializationVector)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
        .encrypt(t.context.secret);
      t.is(
        jwt,
        'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0..AAAAAAAAAAAAAAAA.eKqvvA6MxuqSRbLVFIidFJb8x4lzPytWkoA.aglYAurAaFCoM8sCqaXSyw',
      );
    });

    test('new EncryptJWT', (t) => {
      t.throws(() => new EncryptJWT(), {
        instanceOf: TypeError,
        message: 'JWT Claims Set MUST be an object',
      });
    });

    async function testJWTsetFunction(
      t,
      method,
      claim,
      value,
      duplicate = false,
      expected = value,
    ) {
      let enc = new EncryptJWT({})
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
        [method](value);

      if (duplicate) {
        enc = enc[`replicate${method.substr(3)}AsHeader`]();
      }

      const jwt = await enc.encrypt(t.context.secret);

      const { plaintext, protectedHeader } = await compactDecrypt(jwt, async (header, token) => {
        t.true('alg' in header);
        t.true('enc' in header);
        t.is(header.alg, 'dir');
        t.is(header.enc, 'A128GCM');
        t.true('ciphertext' in token);
        t.true('iv' in token);
        t.true('protected' in token);
        t.true('tag' in token);
        return t.context.secret;
      });
      const payload = JSON.parse(new TextDecoder().decode(plaintext));
      t.is(payload[claim], expected);
      if (duplicate) {
        t.true(claim in protectedHeader);
        t.is(protectedHeader[claim], expected);
      } else {
        t.false(claim in protectedHeader);
      }
    }
    testJWTsetFunction.title = (title, method, claim, value) =>
      `EncryptJWT.prototype.${method} called with ${value}${title ? ` (${title})` : ''}`;

    test(testJWTsetFunction, 'setIssuer', 'iss', 'urn:example:issuer');
    test('duplicated', testJWTsetFunction, 'setIssuer', 'iss', 'urn:example:issuer', true);
    test(testJWTsetFunction, 'setSubject', 'sub', 'urn:example:subject');
    test('duplicated', testJWTsetFunction, 'setSubject', 'sub', 'urn:example:subject', true);
    test(testJWTsetFunction, 'setAudience', 'aud', 'urn:example:audience');
    test('duplicated', testJWTsetFunction, 'setAudience', 'aud', 'urn:example:audience', true);
    test(testJWTsetFunction, 'setJti', 'jti', 'urn:example:jti');
    test(testJWTsetFunction, 'setIssuedAt', 'iat', 0);
    test(testJWTsetFunction, 'setIssuedAt', 'iat', undefined, undefined, now);
    test(testJWTsetFunction, 'setExpirationTime', 'exp', 0);
    test(testJWTsetFunction, 'setExpirationTime', 'exp', '10s', undefined, now + 10);
    test(testJWTsetFunction, 'setNotBefore', 'nbf', 0);
    test(testJWTsetFunction, 'setNotBefore', 'nbf', '10s', undefined, now + 10);

    test('EncryptJWT.prototype.setProtectedHeader', (t) => {
      t.throws(
        () => new EncryptJWT(t.context.payload).setProtectedHeader({}).setProtectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setProtectedHeader can only be called once',
        },
      );
    });

    test('EncryptJWT.prototype.setContentEncryptionKey', (t) => {
      t.throws(
        () =>
          new EncryptJWT(t.context.payload)
            .setContentEncryptionKey(t.context.secret)
            .setContentEncryptionKey(t.context.secret),
        {
          instanceOf: TypeError,
          message: 'setContentEncryptionKey can only be called once',
        },
      );
    });

    test('EncryptJWT.prototype.setInitializationVector', (t) => {
      t.throws(
        () =>
          new EncryptJWT(t.context.payload)
            .setInitializationVector(t.context.initializationVector)
            .setInitializationVector(t.context.initializationVector),
        {
          instanceOf: TypeError,
          message: 'setInitializationVector can only be called once',
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
