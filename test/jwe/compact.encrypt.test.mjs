/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jwe/compact/encrypt`).then(
  ({ default: CompactEncrypt }) => {
    test.before(async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.initializationVector = new Uint8Array(12);
      t.context.secret = new Uint8Array(16);
    });

    test('CompactEncrypt', async (t) => {
      const jwe = await new CompactEncrypt(t.context.plaintext)
        .setInitializationVector(t.context.initializationVector)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
        .encrypt(t.context.secret);
      t.deepEqual(
        jwe,
        'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0..AAAAAAAAAAAAAAAA.Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M.Y5cdeOSFYNyxcPWQlrVFzw',
      );
    });

    test('CompactEncrypt.prototype.setProtectedHeader', (t) => {
      t.throws(
        () => new CompactEncrypt(t.context.plaintext).setProtectedHeader({}).setProtectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setProtectedHeader can only be called once',
        },
      );
    });

    test('CompactEncrypt.prototype.setKeyManagementParameters', (t) => {
      t.throws(
        () =>
          new CompactEncrypt(t.context.plaintext)
            .setKeyManagementParameters({})
            .setKeyManagementParameters({}),
        {
          instanceOf: TypeError,
          message: 'setKeyManagementParameters can only be called once',
        },
      );
    });

    test('CompactEncrypt.prototype.setInitializationVector', (t) => {
      t.throws(
        () =>
          new CompactEncrypt(t.context.plaintext)
            .setInitializationVector(t.context.initializationVector)
            .setInitializationVector(t.context.initializationVector),
        {
          instanceOf: TypeError,
          message: 'setInitializationVector can only be called once',
        },
      );
    });

    test('CompactEncrypt.prototype.setContentEncryptionKey', (t) => {
      t.throws(
        () =>
          new CompactEncrypt(t.context.plaintext)
            .setContentEncryptionKey(t.context.secret)
            .setContentEncryptionKey(t.context.secret),
        {
          instanceOf: TypeError,
          message: 'setContentEncryptionKey can only be called once',
        },
      );
    });

    test('CompactEncrypt.prototype.encrypt must have a JOSE header', async (t) => {
      await t.throwsAsync(new CompactEncrypt(t.context.plaintext).encrypt(t.context.secret), {
        code: 'ERR_JWE_INVALID',
        message:
          'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
      });
    });

    test('CompactEncrypt.prototype.encrypt JOSE header have an alg', async (t) => {
      await t.throwsAsync(
        new CompactEncrypt(t.context.plaintext)
          .setProtectedHeader({ enc: 'A128GCM' })
          .encrypt(t.context.secret),
        {
          code: 'ERR_JWE_INVALID',
          message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
        },
      );
    });

    test('CompactEncrypt.prototype.encrypt JOSE header have an enc', async (t) => {
      await t.throwsAsync(
        new CompactEncrypt(t.context.plaintext)
          .setProtectedHeader({ alg: 'dir' })
          .encrypt(t.context.secret),
        {
          code: 'ERR_JWE_INVALID',
          message: 'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid',
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
