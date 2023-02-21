import QUnit from 'qunit'
import run from './run.js'
// @ts-ignore
import * as lib from '#dist/webapi'

export default {
  async test() {
    await new Promise((resolve, reject) => {
      run(QUnit, lib, (results) => {
        if (results?.failed !== 0) {
          reject()
        } else {
          // @ts-ignore
          resolve()
        }
      })
    })
  },
}
