const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))

delete pkg.devDependencies
delete pkg.scripts
delete pkg.imports
delete pkg.description
delete pkg.browser
delete pkg.exports['.'].browser
delete pkg.exports['.'].require
delete pkg.keywords

pkg.files.push('!dist/**/package.json')
pkg.files.push('!dist/browser/**/*')
pkg.files.push('!dist/node/cjs/**/*')
pkg.main = pkg.exports['.'].import
pkg.name = 'jose-node-esm-runtime'
pkg.type = 'module'

writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
unlinkSync('./CHANGELOG.md')
unlinkSync('./README.md')
