const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))

delete pkg.devDependencies
delete pkg.scripts
delete pkg.imports
delete pkg.description
delete pkg.main
delete pkg.exports['.'].import
delete pkg.exports['.'].require
delete pkg.keywords

pkg.files.push('!dist/**/package.json')
pkg.files.push('!dist/node/**/*')
pkg.files.push('dist/**/*.bundle.js')
pkg.files.push('dist/**/*.umd.js')
pkg.files.push('dist/**/*.min.js')
pkg.name = 'jose-browser-runtime'
pkg.type = 'module'

writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
unlinkSync('./CHANGELOG.md')
unlinkSync('./README.md')
