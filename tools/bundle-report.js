// Bundles every published subpath on its own and reports two things:
//
//   size   - the minified byte count a CDN consumer actually downloads for that import
//   bleed  - occurrences of algorithm names belonging to the *other* JOSE family
//
// The second one is the point. A JWS import must not ship the RSA-OAEP / ECDH-ES key paths and
// a JWE import must not ship the ECDSA / ML-DSA ones. That only holds while family knowledge
// stays in the two registries and everything below them takes a resolved entry: a function that
// switches on the identifier has to enumerate both families, and no bundler can split a function
// body. A byte ceiling would notice such a regression late and vaguely; naming the forbidden
// strings says which import grew and what leaked into it.
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
import { dirname, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const { exports: exportsMap } = JSON.parse(readFileSync('package.json', 'utf8'))

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

/** Which family a subpath belongs to, or null when it legitimately spans both. */
function family(subpath) {
  if (
    subpath.startsWith('./jws/') ||
    subpath === './jwt/sign' ||
    subpath === './jwt/verify' ||
    subpath === './sd-jwt'
  ) {
    return 'jws'
  }
  // A JWKS resolves public keys for verifying signatures, and an embedded JWK is a JWS Header
  // Parameter. Both are documented as such, so both are held to the JWS side.
  if (subpath.startsWith('./jwks/') || subpath === './jwk/embedded') return 'jws'
  if (subpath.startsWith('./jwe/') || subpath === './jwt/encrypt' || subpath === './jwt/decrypt') {
    return 'jwe'
  }
  // '.', './key/*', './jwk/thumbprint', './errors', './base64url', './jwt/decode',
  // './jwt/unsecured', './decode/protected_header'
  return null
}

/**
 * Every dist module an entry point transitively imports. A bundle is the concatenation of exactly
 * this set, so scanning it for the forbidden names is as strong as scanning the bundle - and needs
 * no bundler, which is what lets --check run against the dist the build job already produced.
 *
 * It is only as strong as long as no shared module carries a name it does not use: a bundler drops
 * an unused export, this does not. That is a property worth holding to anyway.
 */
function reachable(entry) {
  const seen = new Set()
  const stack = [resolve(entry)]
  while (stack.length) {
    const file = stack.pop()
    if (seen.has(file)) continue
    const source = readFileSync(file, 'utf8')
    seen.add(file)
    const specifiers = [
      ...source.matchAll(/^\s*(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]/gm),
      ...source.matchAll(/^\s*import\s*['"]([^'"]+)['"]/gm),
    ]
    for (const [, specifier] of specifiers) {
      if (specifier.startsWith('.')) stack.push(resolve(dirname(file), specifier))
    }
  }
  return seen
}

const check = process.argv.includes('--check')
const results = []

for (const [subpath, target] of Object.entries(exportsMap)) {
  if (subpath === './package.json') continue
  const entry = typeof target === 'string' ? target : target.default
  const fam = family(subpath)

  const modules = reachable(entry)
  const forbidden = fam === 'jws' ? JWE_ONLY : fam === 'jwe' ? JWS_ONLY : []
  const bleed = {}
  if (forbidden.length) {
    for (const file of modules) {
      const source = readFileSync(file, 'utf8')
      for (const marker of forbidden) {
        const n = source.split(marker).length - 1
        if (n) bleed[marker] = (bleed[marker] ?? 0) + n
      }
    }
  }

  // Minifying every subpath is only worth it for the size column, which --check does not print.
  let bytes
  if (!check) {
    const { build } = await import('esbuild')
    const { outputFiles } = await build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      format: 'esm',
      target: 'es2022',
      logLevel: 'error',
      write: false,
    })
    bytes = Buffer.byteLength(outputFiles[0].text)
  }

  results.push({
    subpath: subpath === '.' ? 'jose' : `jose/${subpath.slice(2)}`,
    family: fam ?? 'both',
    files: modules.size,
    bytes,
    bleed,
  })
}

results.sort((a, b) => (b.bytes ?? b.files) - (a.bytes ?? a.files))

const isBundle = (file) => /\.(bundle|umd)(\.min)?\.js$/.test(file)

function measure(file) {
  const source = readFileSync(file)
  return { file, bytes: source.length, gzip: gzipSync(source, { level: 9 }).length }
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
  const before = new Map((baseline?.subpaths ?? []).map((r) => [r.subpath, r.bytes]))
  const width = Math.max(...results.map((r) => r.subpath.length))
  for (const r of results) {
    const leaked = Object.entries(r.bleed)
      .map(([m, n]) => `${m}×${n}`)
      .join(' ')
    const status = r.family === 'both' ? '(exempt)' : leaked ? `BLEED ${leaked}` : 'clean'
    const size = check ? `${String(r.files).padStart(3)} files` : `${String(r.bytes).padStart(7)}`
    console.log(
      `${r.subpath.padEnd(width)}  ${size}  ${r.family.padEnd(5)}  ${status}${check ? '' : delta(r.bytes, before.get(r.subpath))}`,
    )
  }

  if (check) {
    // nothing further: --check is about the graph, not the artifacts
  } else if (!modules.length) {
    console.log('\ndist/webapi: not built - run `npm run build`')
  } else {
    const label = `dist/webapi modules (${modules.length} files)`
    console.log(
      `\n${label}  ${String(total(modules, 'bytes')).padStart(7)}  ${String(total(modules, 'gzip')).padStart(6)} gz` +
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
    console.log('\ndist/webapi bundles (raw / gzip)')
    for (const a of bundles) {
      console.log(
        `  ${a.file.padEnd(w)}  ${String(a.bytes).padStart(7)}  ${String(a.gzip).padStart(6)} gz${delta(a.bytes, bundlesBefore.get(a.file))}`,
      )
    }
  }
}

const violations = results.filter((r) => Object.keys(r.bleed).length)
if (violations.length) {
  console.error(`\n${violations.length} subpath(s) ship cross-family code`)
  if (process.argv.includes('--check')) process.exit(1)
}
