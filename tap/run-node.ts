import { parseArgs } from 'node:util'

import QUnit from 'qunit'

import run from './run.js'

const {
  values: { dist, keys = dist },
} = parseArgs({ options: { dist: { type: 'string' }, keys: { type: 'string' } } })

const stats: QUnit.DoneDetails = await new Promise(async (resolve) => {
  run(QUnit, await import(dist), await import(keys), resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exitCode = 1
}
