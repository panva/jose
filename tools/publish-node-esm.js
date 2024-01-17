const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))

pkg.devDependencies = undefined
pkg.scripts = undefined
pkg.imports = undefined
pkg.description = undefined
pkg.browser = undefined
pkg.deno = undefined
pkg.exports['.'].browser = undefined
pkg.exports['.'].deno = undefined
pkg.exports['.'].require = undefined
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
