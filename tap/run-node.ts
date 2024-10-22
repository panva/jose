/// <reference types="node"/>

import { parseArgs } from 'node:util'
import * as lib from '../src/index.js'

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
  process.exitCode = 1
}
