import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/lib/secs`).then(
  ({ default: secs }) => {
    test('lib/secs.ts', (t) => {
      for (const v of ['sec', 'secs', 'second', 'seconds', 's']) {
        t.is(secs(`1${v}`), 1);
        t.is(secs(`1 ${v}`), 1);
      }
      for (const v of ['minute', 'minutes', 'min', 'mins', 'm']) {
        t.is(secs(`1${v}`), 60);
        t.is(secs(`1 ${v}`), 60);
      }
      for (const v of ['hour', 'hours', 'hr', 'hrs', 'h']) {
        t.is(secs(`1${v}`), 3600);
        t.is(secs(`1 ${v}`), 3600);
      }
      for (const v of ['day', 'days', 'd']) {
        t.is(secs(`1${v}`), 86400);
        t.is(secs(`1 ${v}`), 86400);
      }
      for (const v of ['week', 'weeks', 'w']) {
        t.is(secs(`1${v}`), 604800);
        t.is(secs(`1 ${v}`), 604800);
      }
      for (const v of ['years', 'year', 'yrs', 'yr', 'y']) {
        t.is(secs(`1${v}`), 31557600);
        t.is(secs(`1 ${v}`), 31557600);
      }

      t.throws(() => secs('1 fortnight'), {
        instanceOf: TypeError,
        message: 'invalid time period format',
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
