/// <reference types="node"/>

import { parseArgs } from 'node:util'
import * as lib from '#dist'

import QUnit from 'qunit'

import run from './run.js'

const {
  values: { keys },
} = parseArgs({ options: { keys: { type: 'string' } } })

import { stub } from './keyobject-stub.js'

const stats: QUnit.DoneDetails = await new Promise(async (resolve) => {
  run(QUnit, lib, keys === 'KeyObject' ? stub : lib, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exitCode = 1
}
