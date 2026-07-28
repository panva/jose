const { execSync } = require('child_process')
const { globSync, readdirSync, readFileSync, writeFileSync, rmSync } = require('fs')
const { version } = require('../package.json')

const opts = { stdio: 'inherit' }

// The JOSE identifier unions each carry a `(string & {})` arm, so a plain string stays assignable
// and no call site changes meaning; the enumeration exists to give editors something to complete.
// They are `@ignore`d, which keeps typedoc from giving them pages or listing entries, and what is
// left is the bare name in the signatures that reference them - rewritten to `string` below, since
// that is what they are to a reader.
const openUnions = [
  'GenerateKeyPairAlgorithm',
  'GenerateSecretAlgorithm',
  'JWEContentEncryptionAlgorithm',
  'JWEKeyManagementAlgorithm',
  'JWKKeyType',
  'JWSAlgorithm',
  'JWTClaimValidationReason',
]

// docs/README.md is hand-written, typedoc must not clobber it
const readme = readFileSync('docs/README.md')

for (const entry of readdirSync('docs')) {
  if (entry === 'README.md') continue
  rmSync(`docs/${entry}`, { recursive: true, force: true })
}

execSync('npx patch-package', opts)
execSync(`npm run docs:generate -- --gitRevision v${version}`, opts)

globSync('docs/**/*.md').forEach((file) => {
  const content = readFileSync(file, 'utf-8')
    .replaceAll('\\<`ArrayBufferLike`\\>', '')
    .replace(new RegExp(`\`(?:${openUnions.join('|')})\``, 'g'), '`string`')
    // an inline union carrying the arm - "sig" | "enc" | (string & {}) and the like - widens the
    // same way, wherever typedoc sorted the arm within it
    .replace(
      /^(• .*?[:=] )([^=\n]*`string` & `object`[^=\n]*)/gm,
      (_, head, union) => `${head}\`string\`${union.endsWith(' ') ? ' ' : ''}`,
    )
    // and a union of several of them folds to one. The negative lookahead keeps `string` \|
    // `string`[] intact, where the second arm merely starts the same way.
    .replace(/`string`(?: \\\| `string`(?!\[))+/g, '`string`')
    // JWK and JWKParameters are type aliases only so that they carry the implicit index signature an
    // interface does not. Their whole type is one object literal, which typedoc states as `object`
    // before listing the members under "Type Declaration" anyway - so the line carries nothing an
    // interface's page would have had, and goes.
    .replace(/^• \*\*\w+\*\* = `object`\n\n/gm, '')

  writeFileSync(file, content, 'utf-8')
})

writeFileSync('docs/README.md', readme)
