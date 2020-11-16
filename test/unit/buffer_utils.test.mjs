import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/lib/buffer_utils`).then(
  ({ uint32be }) => {
    test('lib/buffer_utils.ts', (t) => {
      t.throws(() => uint32be(-1), { instanceOf: RangeError });
      t.throws(() => uint32be(2 ** 32), { instanceOf: RangeError });
    });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
