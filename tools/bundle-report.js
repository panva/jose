// Bundles every published subpath on its own and reports two things:
//
//   size   - raw, gzip, and Brotli byte counts for a minified consumer import
//   bleed  - occurrences of algorithm names belonging to the *other* JOSE family in the emitted
//            bundle, or a general key-import module contributing bytes to a JWKS-only graph
//
// The second one is the point. A JWS import must not ship the RSA-OAEP / ECDH-ES key paths and a
// JWE import must not ship the ECDSA / ML-DSA ones. Catalogs deliberately share PURE-marked recipe
// barrels, so reachability alone is no longer equivalent to shipped code. Inspect the actual
// minified output and only count modules that contribute bytes. A byte ceiling would notice such a
// regression late and vaguely; naming the forbidden strings says which import grew and what leaked
// into it. Compressed sizes are informational because Node and its bundled zlib version move
// independently of this project.
//
// The key-material APIs are general purpose - importJWK, exportJWK and generateKeyPair have to
// know every algorithm - so they are exempt rather than expected to pass.
//
// Usage:
//   node tools/bundle-report.js                  report only
//   node tools/bundle-report.js --check          exit 1 on any bleed in a non-exempt subpath
//   node tools/bundle-report.js --json           machine-readable
//   node tools/bundle-report.js --baseline f.json  show the change against a saved --json run
import { globSync, readFileSync } from 'node:fs'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import { build } from 'esbuild'

const { exports: jsrExports } = JSON.parse(readFileSync('jsr.json', 'utf8'))

/** Algorithm names that only a JWE implementation has any use for. */
const JWE_ONLY = [
  'RSA-OAEP',
  'AES-KW',
  'AES-GCM',
  'AES-CBC',
  'PBKDF2',
  'ECDH',
  'X25519',
  'deflate-raw',
]

// Algorithm names that only a JWS implementation has any use for. HMAC is deliberately absent:
// JWE uses it for the AES-CBC HMAC tag and aeskw imports the CEK under a nominal HMAC algorithm,
// so it says nothing about family bleed.
const JWS_ONLY = ['RSASSA-PKCS1-v1_5', 'RSA-PSS', 'ECDSA', 'ML-DSA', 'Ed25519']

// Local and remote JWKS resolution only imports public JWS verification keys. Keep it off the
// general key-material path, whose descriptor resolution also serves JWE key imports.
const JWKS_FORBIDDEN_MODULES = ['key/import.js', 'lib/jwk_to_key_resolved.js']

/** Which family a subpath belongs to, or null when it legitimately spans both. */
function family(subpath) {
  if (subpath === './algorithms/jws') return 'jws'
  if (subpath.startsWith('./algorithms/jwe')) return 'jwe'

  const api = subpath.startsWith('./composable/')
    ? `./${subpath.slice('./composable/'.length)}`
    : subpath
  if (api.startsWith('./jws/') || api === './jwt/sign' || api === './jwt/verify') {
    return 'jws'
  }
  // A JWKS resolves public keys for verifying signatures, and an embedded JWK is a JWS Header
  // Parameter. Both are documented as such, so both are held to the JWS side.
  if (api.startsWith('./jwks/') || api === './jwk/embedded') return 'jws'
  if (api.startsWith('./jwe/') || api === './jwt/encrypt' || api === './jwt/decrypt') {
    return 'jwe'
  }
  // '.', './key/*', './jwk/thumbprint', './errors', './base64url', './jwt/decode',
  // './jwt/unsecured', './decode/protected_header'
  return null
}

const check = process.argv.includes('--check')
const results = []

function compressedSize(source) {
  return {
    gzip: gzipSync(source, { level: 9 }).length,
    brotli: brotliCompressSync(source, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}

for (const [subpath, target] of Object.entries(jsrExports)) {
  const entry = target.replace(/^\.\/src\//u, './dist/webapi/').replace(/\.ts$/u, '.js')
  const fam = family(subpath)

  const result = await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'es2022',
    logLevel: 'error',
    metafile: true,
    write: false,
  })
  const source = result.outputFiles[0].contents
  const sourceText = Buffer.from(source).toString()
  const output = Object.values(result.metafile.outputs)[0]
  const modules = new Set(
    Object.entries(output.inputs)
      .filter(([, contribution]) => contribution.bytesInOutput)
      .map(([file]) => file),
  )
  const forbidden = fam === 'jws' ? JWE_ONLY : fam === 'jwe' ? JWS_ONLY : []
  const bleed = {}
  if (forbidden.length) {
    for (const marker of forbidden) {
      const n = sourceText.split(marker).length - 1
      if (n) bleed[marker] = n
    }
  }
  if (subpath.startsWith('./jwks/') || subpath.startsWith('./composable/jwks/')) {
    for (const file of modules) {
      const normalized = file.replaceAll('\\', '/')
      for (const marker of JWKS_FORBIDDEN_MODULES) {
        if (normalized.endsWith(`/${marker}`)) bleed[marker] = (bleed[marker] ?? 0) + 1
      }
    }
  }

  let bytes
  let gzip
  let brotli
  if (!check) {
    bytes = source.length
    ;({ gzip, brotli } = compressedSize(source))
  }

  results.push({
    subpath: subpath === '.' ? 'jose' : `jose/${subpath.slice(2)}`,
    family: fam ?? 'both',
    files: modules.size,
    bytes,
    gzip,
    brotli,
    bleed,
  })
}

results.sort((a, b) => (b.bytes ?? b.files) - (a.bytes ?? a.files))

const isBundle = (file) => /\.(bundle|umd)(\.min)?\.js$/.test(file)

function measure(file) {
  const source = readFileSync(file)
  return { file, bytes: source.length, ...compressedSize(source) }
}

/**
 * The unbundled ESM tree. This is what npm ships and what Node and every bundler actually load; its
 * total is the ceiling on what any consumer could pull in, and its file count says how the
 * implementation is divided.
 */
const modules = globSync('dist/webapi/**/*.js')
  .filter((file) => !isBundle(file))
  .sort()
  .map(measure)

/**
 * The prebuilt bundles, which are a separate deliverable - a CDN script tag rather than an import.
 * jose/index above should match index.bundle.min.js to the byte.
 */
const bundles = globSync('dist/webapi/*.js').filter(isBundle).sort().map(measure)

const total = (list, key) => list.reduce((sum, a) => sum + a[key], 0)

const baselineArg = process.argv.indexOf('--baseline')
const baseline = baselineArg === -1 ? null : JSON.parse(readFileSync(process.argv[baselineArg + 1]))

/** Renders a byte count, with the change against the baseline when there is one. */
function delta(now, before) {
  if (before === undefined || before === now) return ''
  const diff = now - before
  const pct = ((diff / before) * 100).toFixed(1)
  return ` ${diff > 0 ? '+' : ''}${diff} (${diff > 0 ? '+' : ''}${pct}%)`
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ subpaths: results, modules, bundles }, null, 2))
} else {
  const before = new Map((baseline?.subpaths ?? []).map((r) => [r.subpath, r]))
  const width = Math.max(...results.map((r) => r.subpath.length))
  if (!check) console.log(`${'subpath'.padEnd(width)}      raw    gzip      br`)
  for (const r of results) {
    const leaked = Object.entries(r.bleed)
      .map(([m, n]) => `${m}×${n}`)
      .join(' ')
    const status = r.family === 'both' ? '(exempt)' : leaked ? `BLEED ${leaked}` : 'clean'
    const previous = before.get(r.subpath)
    const size = check
      ? `${String(r.files).padStart(3)} files`
      : `${String(r.bytes).padStart(7)} ${String(r.gzip).padStart(7)} ${String(r.brotli).padStart(7)}`
    const changes = previous
      ? [
          ['raw', delta(r.bytes, previous.bytes)],
          ['gz', delta(r.gzip, previous.gzip)],
          ['br', delta(r.brotli, previous.brotli)],
        ]
          .filter(([, change]) => change)
          .map(([label, change]) => `${label}${change}`)
          .join(', ')
      : ''
    console.log(
      `${r.subpath.padEnd(width)}  ${size}  ${r.family.padEnd(5)}  ${status}${changes ? `  ${changes}` : ''}`,
    )
  }

  if (check) {
    // nothing further: --check is about the graph, not the artifacts
  } else if (!modules.length) {
    console.log('\ndist/webapi: not built - run `npm run build`')
  } else {
    const label = `dist/webapi modules (${modules.length} files)`
    console.log(
      `\n${label}  ${String(total(modules, 'bytes')).padStart(7)}  ${String(total(modules, 'gzip')).padStart(6)} gz  ${String(total(modules, 'brotli')).padStart(6)} br` +
        delta(
          total(modules, 'bytes'),
          baseline ? total(baseline.modules ?? [], 'bytes') : undefined,
        ),
    )

    const largest = [...modules].sort((a, b) => b.bytes - a.bytes).slice(0, 8)
    const mw = Math.max(...largest.map((a) => a.file.length))
    for (const a of largest) {
      console.log(`  ${a.file.padEnd(mw)}  ${String(a.bytes).padStart(6)}`)
    }
  }

  if (check) {
    // as above
  } else if (!bundles.length) {
    console.log('\ndist/webapi bundles: not built - run `npm run build-all`')
  } else {
    const bundlesBefore = new Map((baseline?.bundles ?? []).map((a) => [a.file, a.bytes]))
    const w = Math.max(...bundles.map((a) => a.file.length))
    console.log('\ndist/webapi bundles (raw / gzip / Brotli)')
    for (const a of bundles) {
      console.log(
        `  ${a.file.padEnd(w)}  ${String(a.bytes).padStart(7)}  ${String(a.gzip).padStart(6)} gz  ${String(a.brotli).padStart(6)} br${delta(a.bytes, bundlesBefore.get(a.file))}`,
      )
    }
  }
}

const violations = results.filter((r) => Object.keys(r.bleed).length)
if (violations.length) {
  console.error(`\n${violations.length} subpath(s) ship forbidden bundle code`)
  if (process.argv.includes('--check')) process.exit(1)
}
