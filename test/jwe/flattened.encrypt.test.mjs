/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jwe/flattened/encrypt`).then(
  ({ default: FlattenedEncrypt }) => {
    test.before(async (t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.additionalAuthenticatedData = encode('The Fellowship of the Ring');
      t.context.initializationVector = new Uint8Array(12);
      t.context.secret = new Uint8Array(16);
    });

    test('FlattenedEncrypt', async (t) => {
      {
        const jwe = await new FlattenedEncrypt(t.context.plaintext)
          .setInitializationVector(t.context.initializationVector)
          .setProtectedHeader({ alg: 'dir' })
          .setUnprotectedHeader({ enc: 'A128GCM' })
          .encrypt(t.context.secret);
        t.deepEqual(jwe, {
          ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
          header: {
            enc: 'A128GCM',
          },
          iv: 'AAAAAAAAAAAAAAAA',
          protected: 'eyJhbGciOiJkaXIifQ',
          tag: 'OYBq53cJNorm8LoZf4SwsA',
        });
      }
      {
        const jwe = await new FlattenedEncrypt(t.context.plaintext)
          .setInitializationVector(t.context.initializationVector)
          .setProtectedHeader({ alg: 'dir' })
          .setSharedUnprotectedHeader({ enc: 'A128GCM' })
          .encrypt(t.context.secret);
        t.deepEqual(jwe, {
          ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
          unprotected: {
            enc: 'A128GCM',
          },
          iv: 'AAAAAAAAAAAAAAAA',
          protected: 'eyJhbGciOiJkaXIifQ',
          tag: 'OYBq53cJNorm8LoZf4SwsA',
        });
      }
      {
        const jwe = await new FlattenedEncrypt(t.context.plaintext)
          .setInitializationVector(t.context.initializationVector)
          .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
          .encrypt(t.context.secret);
        t.deepEqual(jwe, {
          ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
          unprotected: {
            alg: 'dir',
            enc: 'A128GCM',
          },
          iv: 'AAAAAAAAAAAAAAAA',
          tag: 'vrBCoJmYwG3M6xCZ5VSR3g',
        });
      }
      {
        const jwe = await new FlattenedEncrypt(t.context.plaintext)
          .setInitializationVector(t.context.initializationVector)
          .setProtectedHeader({ alg: 'dir' })
          .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
          .setSharedUnprotectedHeader({ enc: 'A128GCM' })
          .encrypt(t.context.secret);
        t.deepEqual(jwe, {
          aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
          ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
          unprotected: {
            enc: 'A128GCM',
          },
          iv: 'AAAAAAAAAAAAAAAA',
          protected: 'eyJhbGciOiJkaXIifQ',
          tag: 'gEwNlfPZ-O-dG7dTFkhMyQ',
        });
      }
    });

    test('FlattenedEncrypt.prototype.setProtectedHeader', (t) => {
      t.throws(
        () =>
          new FlattenedEncrypt(t.context.plaintext).setProtectedHeader({}).setProtectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setProtectedHeader can only be called once',
        },
      );
    });

    test('FlattenedEncrypt.prototype.setUnprotectedHeader', (t) => {
      t.throws(
        () =>
          new FlattenedEncrypt(t.context.plaintext)
            .setUnprotectedHeader({})
            .setUnprotectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setUnprotectedHeader can only be called once',
        },
      );
    });

    test('FlattenedEncrypt.prototype.setSharedUnprotectedHeader', (t) => {
      t.throws(
        () =>
          new FlattenedEncrypt(t.context.plaintext)
            .setSharedUnprotectedHeader({})
            .setSharedUnprotectedHeader({}),
        {
          instanceOf: TypeError,
          message: 'setSharedUnprotectedHeader can only be called once',
        },
      );
    });

    test('FlattenedEncrypt.prototype.setInitializationVector', (t) => {
      t.throws(
        () =>
          new FlattenedEncrypt(t.context.plaintext)
            .setInitializationVector(t.context.initializationVector)
            .setInitializationVector(t.context.initializationVector),
        {
          instanceOf: TypeError,
          message: 'setInitializationVector can only be called once',
        },
      );
    });

    test('FlattenedEncrypt.prototype.setContentEncryptionKey', (t) => {
      t.throws(
        () =>
          new FlattenedEncrypt(t.context.plaintext)
            .setContentEncryptionKey(t.context.secret)
            .setContentEncryptionKey(t.context.secret),
        {
          instanceOf: TypeError,
          message: 'setContentEncryptionKey can only be called once',
        },
      );
    });

    test('FlattenedEncrypt.prototype.encrypt must have a JOSE header', async (t) => {
      await t.throwsAsync(new FlattenedEncrypt(t.context.plaintext).encrypt(t.context.secret), {
        code: 'ERR_JWE_INVALID',
        message:
          'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
      });
    });

    test('FlattenedEncrypt.prototype.encrypt JOSE header must be disjoint', async (t) => {
      await t.throwsAsync(
        new FlattenedEncrypt(t.context.plaintext)
          .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
          .setUnprotectedHeader({ alg: 'dir' })
          .encrypt(t.context.secret),
        {
          code: 'ERR_JWE_INVALID',
          message:
            'JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
        },
      );
      await t.throwsAsync(
        new FlattenedEncrypt(t.context.plaintext)
          .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
          .setSharedUnprotectedHeader({ alg: 'dir' })
          .encrypt(t.context.secret),
        {
          code: 'ERR_JWE_INVALID',
          message:
            'JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
        },
      );
    });

    test('FlattenedEncrypt.prototype.encrypt JOSE header have an alg', async (t) => {
      await t.throwsAsync(
        new FlattenedEncrypt(t.context.plaintext)
          .setProtectedHeader({ enc: 'A128GCM' })
          .encrypt(t.context.secret),
        {
          code: 'ERR_JWE_INVALID',
          message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
        },
      );
    });

    test('FlattenedEncrypt.prototype.encrypt JOSE header have an enc', async (t) => {
      await t.throwsAsync(
        new FlattenedEncrypt(t.context.plaintext)
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
