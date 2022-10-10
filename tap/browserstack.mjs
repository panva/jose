import browserstack from 'testcafe-browser-provider-browserstack'
import { parseArgs } from 'node:util'

const {
  positionals: { 0: identifier },
} = parseArgs({ allowPositionals: true })

await browserstack.init()

const browserlist = await browserstack.getBrowserList()

let result
switch (identifier) {
  case 'browserstack:safari':
    ;[result] = browserlist.filter(
      (id) => !!new RegExp(`safari@\\\d+\\\.\\\d+:OS X Monterey`).exec(id),
    )
    break
  case 'browserstack:ios':
    ;[result] = browserlist
      .filter((id) => id.startsWith('iPhone'))
      .sort((a, b) => {
        const va = parseFloat(a.split('@')[1])
        const vb = parseFloat(b.split('@')[1])

        return va < vb ? 1 : -1
      })
    break
  default:
    throw new TypeError('unsupported browser identifier')
}

console.log(`browserstack:${result}`)
