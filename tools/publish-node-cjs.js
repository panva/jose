const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))

delete pkg.devDependencies
delete pkg.scripts
delete pkg.imports
delete pkg.description
delete pkg.browser
delete pkg.exports['.'].browser
delete pkg.exports['.'].import
delete pkg.keywords

pkg.files.push('!dist/browser/**/*')
pkg.files.push('!dist/node/esm/**/*')
pkg.main = pkg.exports['.'].require
pkg.name = 'jose-node-cjs-runtime'

writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
unlinkSync('./CHANGELOG.md')
unlinkSync('./README.md')
