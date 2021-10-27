const { strict: assert } = require('assert')
const { writeFileSync, readFileSync } = require('fs')
const { execSync } = require('child_process')

const inputFile = './src/types.d.ts'
const outputFile = './dist/types/types.d.ts'
let types = readFileSync(outputFile, { encoding: 'utf-8' })

const regexJSDocs = /^[\t\s]*\/\*\*[^!#*][\s\S]*?\*\/[\r\n]?/gm
const regexMultilines = /^[\t\s]*\/\*[^!#*][\s\S]*?\*\/[\r\n]?/gm
const emptyLines = /^\s*\n/gm

const inputKeyLikeLine = parseInt(
  execSync(`awk '/export type KeyLike/{ print NR; exit }' ${inputFile}`),
  10,
)
assert(inputKeyLikeLine)
const keyLikeDoc = execSync(`head -n +${inputKeyLikeLine - 1} ${inputFile}`)

writeFileSync(outputFile, keyLikeDoc)

writeFileSync(
  outputFile,
  types.replace(regexJSDocs, '').replace(regexMultilines, '').replace(emptyLines, ''),
  { flag: 'a' },
)
