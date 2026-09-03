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

const jwtConsumerPages = new Set([
  'docs/composable/jwt/decrypt/interfaces/ComposedJWTDecryptFunction.md',
  'docs/composable/jwt/verify/interfaces/JWTVerifyFunction.md',
])

function documentJWTConsumerParameters(content) {
  return content.replace(
    /\| Parameter \| Type \|\n\| ------ \| ------ \|\n((?:\| `(?:jwt|key|getKey|options\?)` \| .+ \|\n?)+)/g,
    (_, rows) => {
      const documented = rows
        .trimEnd()
        .split('\n')
        .map((row) => {
          const [, parameter, type] = row.match(/^\| `([^`]+)` \| (.+) \|$/)
          let description
          switch (parameter) {
            case 'jwt':
              description = 'JWT to process.'
              break
            case 'getKey':
              description =
                'Function resolving a Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210).'
              break
            case 'key':
              description = type.includes('GetKey')
                ? 'Key, Secret, or function resolving one, for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210).'
                : 'Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210).'
              break
            case 'options?':
              description =
                'Options for verification or decryption, including JWT Claims Set validation.'
              break
          }
          return `| \`${parameter}\` | ${type} | ${description} |`
        })
        .join('\n')

      return `| Parameter | Type | Description |\n| ------ | ------ | ------ |\n${documented}\n`
    },
  )
}

// docs/README.md is hand-written, typedoc must not clobber it
const readme = readFileSync('docs/README.md')

for (const entry of readdirSync('docs')) {
  if (entry === 'README.md') continue
  rmSync(`docs/${entry}`, { recursive: true, force: true })
}

execSync('npm exec --no -- patch-package', opts)
execSync(`npm run docs:generate -- --gitRevision v${version}`, opts)

globSync('docs/**/*.md').forEach((file) => {
  let content = readFileSync(file, 'utf-8')
    .replaceAll('\\<`ArrayBufferLike`\\>', '')
    .replace(new RegExp(`\`(?:${openUnions.join('|')})\``, 'g'), '`string`')
    // AlgorithmOf is an internal helper, so leaving its unlinked name in public signatures sends a
    // reader to a type that has deliberately got no documentation page. Every public occurrence
    // supplies a factory tuple; show that equivalent, self-contained expression instead.
    .replaceAll(
      '`AlgorithmOf`\\<`Factories`\\>',
      '[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\\<`Factories`\\[`number`\\]\\>\\[`"algorithm"`\\]',
    )
    // The tuple constraints enforce useful selection rules but are deliberately private type
    // machinery. State those rules in the parameter table instead of leaking unlinked helper names
    // (or typedoc's expanded conditional type) into every compose function signature.
    .replace(
      /^(\| \.\.\.`factories` \| )[^\n]*`UniqueAlgorithmFactories`\\<`Factories`\\>[^\n]*`C`\\<`Factories`, `"jwe-key-management"`\\>[^\n]* \|$/gm,
      '$1`Factories` — algorithm identifiers must be unique and the selection must include at least one key-management and one content-encryption factory |',
    )
    .replace(
      /^(\| \.\.\.`algorithms` \| )`Factories` & `ValidJWSAlgorithmSelection`\\<`Factories`\\> \|$/gm,
      '$1`Factories` — algorithm identifiers must be unique |',
    )
    .replace(
      /^(\| \.\.\.`factories` \| )`Factories` & `UniqueAlgorithmFactories`\\<`Factories`\\> \|$/gm,
      '$1`Factories` — algorithm identifiers must be unique |',
    )
    // an inline union carrying the arm - "sig" | "enc" | (string & {}) and the like - widens the
    // same way, wherever typedoc sorted the arm within it
    .replace(/^(• .*?[:=] )([^=\n]*`string` & `object`[^=\n]*)/gm, (_, head, union) => {
      const trailing = union.endsWith(' ') ? ' ' : ''
      if (/^readonly \(.+\)\[\]$/.test(union.trimEnd())) {
        return `${head}readonly \`string\`[]${trailing}`
      }
      return `${head}\`string\`${trailing}`
    })
    // and a union of several of them folds to one. The negative lookahead keeps `string` \|
    // `string`[] intact, where the second arm merely starts the same way.
    .replace(/`string`(?: \\\| `string`(?!\[))+/g, '`string`')
    // AnyJOSEError intersects each arm with the one `code` literal that arm is thrown with. typedoc
    // renders any object literal as a bare `object`, and a union arm gets no "Type Declaration"
    // section to send the reader to, so the suffix is noise - what is left reads as the union of
    // error classes it is.
    .replace(/^• .*? \\\| .*$/gm, (union) => union.replaceAll(' & `object`', ''))
    // JWK and JWKParameters are type aliases only so that they carry the implicit index signature an
    // interface does not. Their whole type is one object literal, which typedoc states as `object`
    // before listing the members under "Type Declaration" anyway - so the line carries nothing an
    // interface's page would have had, and goes.
    .replace(/^• \*\*\w+\*\* = `object`\n\n/gm, '')
    // The JWT Claims Set types carry a third intersection member that is `unknown` for every type
    // able to describe a Claims Set and `never` for the rest, so that a payload type parameter can
    // be rejected without constraining it - constraining rejects a wrapper forwarding an
    // unconstrained type parameter of its own. It contributes nothing to what the payload IS, so a
    // reader is left with the intersection these pages have always stated.
    .replace(
      / & \\\[`(\w+)`\\\] \*extends\* \\\[`object`\\\] \? `unknown` : `unknown` \*extends\* `\1` \? `unknown` : `never`/g,
      '',
    )

  if (jwtConsumerPages.has(file)) {
    content = documentJWTConsumerParameters(content)
    if (content.includes('| Parameter | Type |\n')) {
      throw new Error(`undocumented JWT consumer parameter table in ${file}`)
    }
  }

  if (
    file.startsWith('docs/composable/') &&
    /\/functions\/compose[^/]+\.md$/.test(file) &&
    /`(?:UniqueAlgorithmFactories|ValidJWSAlgorithmSelection|C)`\\</.test(content)
  ) {
    throw new Error(`private algorithm selection helper leaked into ${file}`)
  }

  writeFileSync(file, content, 'utf-8')
})

writeFileSync('docs/README.md', readme)
