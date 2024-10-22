import QUnit from 'qunit'
import run from './run.js'
import * as lib from '../src/index.js'

export default {
  async test() {
    await new Promise((resolve, reject) => {
      run(QUnit, lib, lib, (results) => {
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
