import QUnit from 'qunit'
import run from './run.js'

run(QUnit, (stats) => {
  // @ts-ignore
  globalThis.stats = stats
})
