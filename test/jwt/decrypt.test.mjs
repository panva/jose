import test from 'ava';
import timekeeper from 'timekeeper';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jwt/encrypt`),
  import(`${root}/jwt/decrypt`),
  import(`${root}/jwe/compact/encrypt`),
]).then(
  ([{ default: EncryptJWT }, { default: jwtDecrypt }, { default: CompactEncrypt }]) => {
    const now = 1604416038;

    test.before(async (t) => {
      t.context.secret = new Uint8Array(32);
      t.context.payload = { 'urn:example:claim': true };

      timekeeper.freeze(now * 1000);
    });

    test.after(timekeeper.reset);

    test('Basic JWT Claims Set verification', async (t) => {
      const issuer = 'urn:example:issuer';
      const subject = 'urn:example:subject';
      const audience = 'urn:example:audience';
      const jti = 'urn:example:jti';
      const nbf = now - 10;
      const iat = now - 20;
      const exp = now + 10;
      const typ = 'urn:example:typ';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ })
        .setIssuer(issuer)
        .setSubject(subject)
        .setAudience(audience)
        .setJti(jti)
        .setNotBefore(nbf)
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .encrypt(t.context.secret);

      await t.notThrowsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          issuer,
          subject,
          audience,
          jti,
          typ,
          maxTokenAge: '30s',
        }),
      );
      await t.notThrowsAsync(jwtDecrypt(new TextEncoder().encode(jwt), t.context.secret));
    });

    test('Payload must be an object', async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      for (const value of [0, 1, -1, true, false, null, [], '']) {
        const token = await new CompactEncrypt(encode(JSON.stringify(value)))
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
          .encrypt(t.context.secret);
        await t.throwsAsync(jwtDecrypt(token, t.context.secret), {
          code: 'ERR_JWT_INVALID',
          message: 'JWT Claims Set must be a top-level JSON object',
        });
      }
    });

    test('Payload must JSON parseable', async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      const token = await new CompactEncrypt(encode('{'))
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(t.context.secret);
      await t.throwsAsync(jwtDecrypt(token, t.context.secret), {
        code: 'ERR_JWT_INVALID',
        message: 'JWT Claims Set must be a top-level JSON object',
      });
    });

    test('contentEncryptionAlgorithms and keyManagementAlgorithms options', async (t) => {
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(t.context.secret);

      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          keyManagementAlgorithms: ['RSA-OAEP'],
        }),
        {
          code: 'ERR_JOSE_ALG_NOT_ALLOWED',
          message: '"alg" (Algorithm) Header Parameter not allowed',
        },
      );
      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          keyManagementAlgorithms: [null],
        }),
        {
          instanceOf: TypeError,
          message: '"keyManagementAlgorithms" option must be an array of strings',
        },
      );
      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          contentEncryptionAlgorithms: ['A128GCM'],
        }),
        {
          code: 'ERR_JOSE_ALG_NOT_ALLOWED',
          message: '"enc" (Encryption Algorithm) Header Parameter not allowed',
        },
      );
      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          contentEncryptionAlgorithms: [null],
        }),
        {
          instanceOf: TypeError,
          message: '"contentEncryptionAlgorithms" option must be an array of strings',
        },
      );
    });

    test('typ verification', async (t) => {
      {
        const typ = 'urn:example:typ';
        const jwt = await new EncryptJWT(t.context.payload)
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ })
          .encrypt(t.context.secret);

        await t.notThrowsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            typ: 'application/urn:example:typ',
          }),
        );

        await t.throwsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            typ: 'urn:example:typ:2',
          }),
          { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
        );

        await t.throwsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            typ: 'application/urn:example:typ:2',
          }),
          { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
        );
      }
      {
        const typ = 'application/urn:example:typ';
        const jwt = await new EncryptJWT(t.context.payload)
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ })
          .encrypt(t.context.secret);

        await t.notThrowsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            typ: 'urn:example:typ',
          }),
        );

        await t.throwsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            typ: 'application/urn:example:typ:2',
          }),
          { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
        );

        await t.throwsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            typ: 'urn:example:typ:2',
          }),
          { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
        );
      }
    });

    test('Issuer[] verification', async (t) => {
      const issuer = 'urn:example:issuer';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuer(issuer)
        .encrypt(t.context.secret);

      await t.notThrowsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          issuer: [issuer],
        }),
      );
    });

    test('Issuer[] verification failed', async (t) => {
      const issuer = 'urn:example:issuer';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuer(issuer)
        .encrypt(t.context.secret);

      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          issuer: [],
        }),
        { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' },
      );
    });

    test('Issuer[] verification failed []', async (t) => {
      const issuer = 'urn:example:issuer';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuer([issuer])
        .encrypt(t.context.secret);

      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          issuer: [],
        }),
        { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' },
      );
    });

    test('Audience[] verification', async (t) => {
      const audience = 'urn:example:audience';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setAudience(audience)
        .encrypt(t.context.secret);

      await t.notThrowsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          audience: [audience],
        }),
      );
    });

    test('Audience[] verification failed', async (t) => {
      const audience = 'urn:example:audience';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setAudience(audience)
        .encrypt(t.context.secret);

      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          audience: [],
        }),
        { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' },
      );
    });

    test('Audience[] verification failed []', async (t) => {
      const audience = 'urn:example:audience';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setAudience([audience])
        .encrypt(t.context.secret);

      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          audience: [],
        }),
        { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' },
      );
    });

    test('Subject verification failed', async (t) => {
      const subject = 'urn:example:subject';
      const jwt = await new EncryptJWT(t.context.payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setSubject(subject)
        .encrypt(t.context.secret);

      await t.throwsAsync(
        jwtDecrypt(jwt, t.context.secret, {
          subject: 'urn:example:subject:2',
        }),
        { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "sub" claim value' },
      );
    });

    async function numericDateNumber(t, claim) {
      const jwt = await new EncryptJWT({ [claim]: null })
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(t.context.secret);

      await t.throwsAsync(jwtDecrypt(jwt, t.context.secret), {
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: `"${claim}" claim must be a number`,
      });
    }
    numericDateNumber.title = (t, claim) => `${claim} must be a number`;

    test('clockTolerance num', async (t) => {
      const jwt = await new EncryptJWT({ exp: now })
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(t.context.secret);

      await t.notThrowsAsync(jwtDecrypt(jwt, t.context.secret, { clockTolerance: 1 }));
      await t.notThrowsAsync(jwtDecrypt(jwt, t.context.secret, { clockTolerance: '1s' }));
      await t.throwsAsync(jwtDecrypt(jwt, t.context.secret, { clockTolerance: null }), {
        instanceOf: TypeError,
        message: 'invalid clockTolerance option type',
      });
    });

    async function failingNumericDate(t, claims, assertion, decryptOptions) {
      const jwt = await new EncryptJWT({ ...claims })
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(t.context.secret);

      await t.throwsAsync(jwtDecrypt(jwt, t.context.secret, { ...decryptOptions }), assertion);
    }

    test(
      'exp must be in the future',
      failingNumericDate,
      { exp: now },
      {
        code: 'ERR_JWT_EXPIRED',
        message: '"exp" claim timestamp check failed',
      },
    );

    test(
      'nbf must be at least now',
      failingNumericDate,
      { nbf: now + 1 },
      {
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: '"nbf" claim timestamp check failed',
      },
    );

    test(
      'iat must be in the past (maxTokenAge, no exp)',
      failingNumericDate,
      { iat: now + 1 },
      {
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: '"iat" claim timestamp check failed (it should be in the past)',
      },
      {
        maxTokenAge: 5,
      },
    );

    test(
      'iat must be in the past (maxTokenAge, with exp)',
      failingNumericDate,
      { iat: now + 1, exp: now + 10 },
      {
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: '"iat" claim timestamp check failed (it should be in the past)',
      },
      {
        maxTokenAge: 5,
      },
    );

    test(
      'iat must be in the past (maxTokenAge, with exp, as a string)',
      failingNumericDate,
      { iat: now + 1, exp: now + 10 },
      {
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: '"iat" claim timestamp check failed (it should be in the past)',
      },
      {
        maxTokenAge: '5s',
      },
    );

    test(
      'maxTokenAge option',
      failingNumericDate,
      { iat: now - 31 },
      {
        code: 'ERR_JWT_EXPIRED',
        message: '"iat" claim timestamp check failed (too far in the past)',
      },
      {
        maxTokenAge: '30s',
      },
    );

    for (const claim of ['iat', 'nbf', 'exp']) {
      test(numericDateNumber, claim);
    }

    async function replicatedClaimCheck(t, claim) {
      {
        const jwt = await new EncryptJWT({ [claim]: 'urn:example' })
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', [claim]: 'urn:example' })
          .encrypt(t.context.secret);

        await t.notThrowsAsync(jwtDecrypt(jwt, t.context.secret));
      }
      {
        const jwt = await new EncryptJWT({ [claim]: 'urn:example:mismatched' })
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', [claim]: 'urn:example' })
          .encrypt(t.context.secret);

        await t.throwsAsync(
          jwtDecrypt(jwt, t.context.secret, {
            code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
            message: `replicated "${claim}" claim header parameter mismatch`,
          }),
        );
      }
    }
    replicatedClaimCheck.title = (t, claim) => `${claim} header claim must match the payload`;

    for (const claim of ['iss', 'sub', 'aud']) {
      test(replicatedClaimCheck, claim);
    }
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
