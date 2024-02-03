const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))

pkg.devDependencies = undefined
pkg.scripts = undefined
pkg.imports = undefined
pkg.description = undefined
pkg.browser = undefined
pkg.deno = undefined
for (const exportPath of Object.keys(pkg.exports)) {
  for (const runtime of ['browser', 'deno', 'require', 'bun', 'worker']) {
    pkg.exports[exportPath][runtime] = undefined
  }
}
pkg.keywords = undefined

pkg.files.push('!dist/**/package.json')
pkg.files.push('!dist/browser/**/*')
pkg.files.push('!dist/node/cjs/**/*')
pkg.main = pkg.exports['.'].import
pkg.name = 'jose-node-esm-runtime'
pkg.type = 'module'

writeFileSync('./package.json', `${JSON.stringify(pkg, null, 2)}\n`)
unlinkSync('./CHANGELOG.md')
unlinkSync('./README.md')
