import QUnit from 'qunit'
import run from './run.js'
// @ts-ignore
import * as lib from '#dist/webapi'

export default {
  async fetch() {
    const results = await new Promise((resolve) => {
      run(QUnit, lib, (results) => {
        resolve(results)
      })
    })

    // @ts-ignore
    return Response.json({ ...results })
  },
}
