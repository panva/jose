import QUnit from 'qunit'
import run from './run.js'

run(QUnit, (stats) => {
  if (stats?.failed !== 0) {
    // @ts-ignore
    process.exitCode = 1
  }
})
