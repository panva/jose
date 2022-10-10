import QUnit from 'qunit'
import run from './run.js'

export default {
  async fetch() {
    const results = await new Promise((resolve) => {
      run(QUnit, (results) => {
        resolve(results)
      })
    })

    // @ts-ignore
    return Response.json({ ...results })
  },
}
