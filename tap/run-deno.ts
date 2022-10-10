import 'qunit'
import run from './run.js'

run(QUnit, (stats) => {
  if (stats?.failed !== 0) {
    // @ts-ignore
    Deno.exit(1)
  }
})
