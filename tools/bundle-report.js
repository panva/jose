// Reports subpath and individual-binding sizes, and checks both the unbundled dependency graph
// and actual tree-shaken consumers. Root and direct imports must retain the same implementation;
// JWS/JWE consumers must stay within their family, and non-General consumers must drop General
// adapters. Size changes are informational, including gzip/Brotli differences between zlib versions.
//
// Usage:
//   node tools/bundle-report.js                  report only
//   node tools/bundle-report.js --check          exit 1 on a graph or tree-shaking violation
//   node tools/bundle-report.js --json           machine-readable
//   node tools/bundle-report.js --baseline f.json  show the change against a saved --json run
import { globSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import { build } from 'esbuild'
import { resolvePackageExport } from './export-map.js'

const { exports: exportsMap } = JSON.parse(readFileSync('package.json', 'utf8'))
const { exports: publicEntries } = JSON.parse(readFileSync('jsr.json', 'utf8'))

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
  if (subpath.startsWith('./jws/') || subpath === './jwt/sign' || subpath === './jwt/verify') {
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

/** Keep the stricter graph check too: unused exports should not hide cross-family dependencies. */
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
const entries = new Map()
const bundleOptions = {
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  logLevel: 'error',
  write: false,
  metafile: true,
}

function forbidden(fam) {
  return fam === 'jws' ? JWE_ONLY : fam === 'jwe' ? JWS_ONLY : []
}

function findBleed(source, fam, bleed = {}) {
  for (const marker of forbidden(fam)) {
    const n = source.split(marker).length - 1
    if (n) bleed[marker] = (bleed[marker] ?? 0) + n
  }
  return bleed
}

function compressedSize(source) {
  return {
    gzip: gzipSync(source, { level: 9 }).length,
    brotli: brotliCompressSync(source, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}

for (const subpath of Object.keys(publicEntries)) {
  const target = resolvePackageExport(exportsMap, subpath)
  const entry = typeof target === 'string' ? target : target.default
  const fam = family(subpath)

  const modules = reachable(entry)
  const bleed = {}
  if (fam) {
    for (const file of modules) {
      findBleed(readFileSync(file, 'utf8'), fam, bleed)
    }
  }

  const { outputFiles, metafile } = await build({ ...bundleOptions, entryPoints: [entry] })
  const source = outputFiles[0].contents
  entries.set(subpath, { entry, exports: Object.values(metafile.outputs)[0].exports })

  results.push({
    subpath: subpath === '.' ? 'jose' : `jose/${subpath.slice(2)}`,
    family: fam ?? 'both',
    files: modules.size,
    bytes: source.length,
    ...compressedSize(source),
    bleed,
  })
}

results.sort((a, b) => (b.bytes ?? b.files) - (a.bytes ?? a.files))

const root = entries.get('.')
const consumer = 'bundle-consumer.js'

/** Measure only code that survived bundling, excluding the barrel and synthetic consumer. */
async function consume(contents, fam) {
  const { outputFiles, metafile } = await build({
    ...bundleOptions,
    stdin: { contents, resolveDir: process.cwd(), sourcefile: consumer },
  })
  const source = outputFiles[0].contents
  const inputs = Object.values(metafile.outputs)[0].inputs
  return {
    bytes: source.length,
    ...compressedSize(source),
    files: Object.keys(inputs)
      .filter(
        (file) =>
          inputs[file].bytesInOutput > 0 &&
          resolve(file) !== resolve(root.entry) &&
          resolve(file) !== resolve(consumer),
      )
      .sort(),
    bleed: findBleed(outputFiles[0].text, fam),
  }
}

const bindings = []
const rootBindings = new Set(['cryptoRuntime'])
for (const [subpath, { entry, exports }] of entries) {
  if (subpath === '.') continue
  const namespace = subpath === './errors' || subpath === './base64url' ? subpath.slice(2) : null
  const fam = family(subpath)
  for (const binding of namespace ? [...exports, '*'] : exports) {
    const rootName = namespace ?? binding
    if (!root.exports.includes(rootName)) throw new Error(`Missing root export: ${rootName}`)
    rootBindings.add(rootName)
    const rootValue = namespace && binding !== '*' ? `${namespace}.${binding}` : rootName
    const directImport = binding === '*' ? '* as value' : `{ ${binding} as value }`
    const [fromRoot, direct] = await Promise.all([
      consume(
        `import { ${rootName} } from '${root.entry}'; export const value = ${rootValue}`,
        fam,
      ),
      consume(`import ${directImport} from '${entry}'; export { value }`, fam),
    ])
    const violations = []
    if (fromRoot.files.join('\n') !== direct.files.join('\n')) {
      violations.push('root/direct retain different implementation modules')
    }
    for (const [source, report] of Object.entries({ root: fromRoot, direct })) {
      if (Object.keys(report.bleed).length) violations.push(`${source}: cross-family code`)
      if (
        !subpath.includes('/general/') &&
        report.files.some((file) => /\/(jws|jwe)\/general\//.test(file))
      ) {
        violations.push(`${source}: retains General orchestration`)
      }
    }
    bindings.push({
      subpath: `jose/${subpath.slice(2)}`,
      binding,
      family: fam ?? 'both',
      root: fromRoot,
      direct,
      violations,
    })
  }
}
for (const binding of root.exports) {
  if (!rootBindings.has(binding)) throw new Error(`Missing consumer for root export: ${binding}`)
}

const runtime = await consume(`export { cryptoRuntime as value } from '${root.entry}'`, null)
bindings.push({
  subpath: 'jose',
  binding: 'cryptoRuntime',
  family: 'both',
  root: runtime,
  violations: runtime.files.length ? ['cryptoRuntime retains implementation modules'] : [],
})

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
const bindingName = (r) => `${r.subpath}:${r.binding}`
const bindingsBefore = new Map((baseline?.bindings ?? []).map((r) => [bindingName(r), r]))
for (const binding of bindings) {
  const before = bindingsBefore.get(bindingName(binding))
  for (const route of ['root', 'direct']) {
    if (binding[route] && before?.[route]) {
      binding[route].delta = Object.fromEntries(
        ['bytes', 'gzip', 'brotli'].map((key) => [key, binding[route][key] - before[route][key]]),
      )
    }
  }
}

/** Renders a byte count, with the change against the baseline when there is one. */
function delta(now, before) {
  if (before === undefined || before === now) return ''
  const diff = now - before
  const pct = ((diff / before) * 100).toFixed(1)
  return ` ${diff > 0 ? '+' : ''}${diff} (${diff > 0 ? '+' : ''}${pct}%)`
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ subpaths: results, bindings, modules, bundles }, null, 2))
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

  const bw = Math.max(...bindings.map((r) => bindingName(r).length))
  console.log(
    check
      ? `\n${bindings.length} individual bindings checked`
      : `\n${'binding'.padEnd(bw)}  import      raw    gzip      br`,
  )
  for (const binding of bindings) {
    const previous = bindingsBefore.get(bindingName(binding))
    for (const route of check ? [] : ['root', 'direct']) {
      const report = binding[route]
      if (!report) continue
      const changes = ['bytes', 'gzip', 'brotli']
        .map((key) => [key === 'bytes' ? 'raw' : key, delta(report[key], previous?.[route]?.[key])])
        .filter(([, change]) => change)
        .map(([key, change]) => `${key}${change}`)
        .join(', ')
      console.log(
        `${bindingName(binding).padEnd(bw)}  ${route.padEnd(6)} ${String(report.bytes).padStart(7)} ${String(report.gzip).padStart(7)} ${String(report.brotli).padStart(7)}${changes ? `  ${changes}` : ''}`,
      )
    }
    for (const violation of binding.violations)
      console.log(`  FAIL ${bindingName(binding)}: ${violation}`)
  }

  if (check) {
    // --check omits artifact sizes
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

const graphViolations = results.filter((r) => Object.keys(r.bleed).length)
const bindingViolations = bindings.filter((r) => r.violations.length)
if (graphViolations.length || bindingViolations.length) {
  console.error(
    `\n${graphViolations.length} subpath(s) ship cross-family code; ${bindingViolations.length} binding(s) fail tree-shaking checks`,
  )
  if (check) process.exit(1)
}
