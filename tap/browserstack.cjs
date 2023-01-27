const browserstack = require('testcafe-browser-provider-browserstack')
const { parseArgs } = require('node:util')

const {
  positionals: { 0: identifier },
} = parseArgs({ allowPositionals: true })

browserstack
  .init()
  .then(() => browserstack.getBrowserList())
  .then((browserlist) => {
    let result
    switch (identifier) {
      case 'browserstack:android':
        ;[result] = browserlist
          .filter((id) => id.startsWith('Google Pixel'))
          .sort((a, b) => {
            const va = parseFloat(a.split('@')[1])
            const vb = parseFloat(b.split('@')[1])

            return va < vb ? 1 : -1
          })
        break
      case 'browserstack:safari':
        ;[result] = browserlist
          .filter((id) => !!new RegExp(`safari@\\\d+\\\.\\\d+:[^W]`).exec(id))
          .sort((a, b) => {
            const va = parseFloat(a.split('@')[1])
            const vb = parseFloat(b.split('@')[1])

            return va < vb ? 1 : -1
          })
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
  })
