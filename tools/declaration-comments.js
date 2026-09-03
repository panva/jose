// Prepares the JSDoc in the published declarations for where it is actually read - an editor hover
// - by dropping what is written for the generated documentation and rewriting what only renders
// correctly on a docs page. docs/ is generated from src, so it keeps all of it.
//
//   @example blocks       - 22% of dist/types, and typedoc renders them on the page the reader is
//                           already on. Stripping them is not new: tools/postbump.cjs did it at
//                           release time, but its stripper treated any fence that was not ```js as
//                           the end of the example, so a ```ts one ended removal at the opening
//                           fence and left the body behind. jose 6.2.3 and 6.2.4 ship five orphaned
//                           code blocks and three stray `// @ts-ignore` lines in
//                           dist/types/jwks/remote.d.ts because of it. Doing it here instead puts
//                           the result under the type and packaging gates, and makes a local build
//                           match what is published.
//
//   the subpath note      - "This function is exported (as a named export) from the main 'jose'
//                           module entry point as well as from its subpath export
//                           'jose/jwt/verify'." and its variants. Load-bearing on a docs page,
//                           since typedoc names its folders after source paths and that sentence is
//                           the only place the real specifier appears; noise in an editor hover.
//
//   module documentation - TypeScript attaches it to the first import but does not expose it as
//                          useful module documentation in an editor.
//
//   extended prose       - only the first summary paragraph, alerts, signature-help tags, and
//                          @deprecated are useful in editor hovers. The rest remains in src for
//                          generated documentation.
//
//   @ignore and friends   - typedoc acts on them, TypeScript does not, so they reach the reader as
//                           a bare tag that means nothing to them.
//
//   GitHub alerts         - `> [!NOTE]` and the rest of the GFM set render as an admonition on
//                           GitHub and in the docs, and as a literal `[!NOTE]\` in a hover. The
//                           blockquote itself does carry over, so keep it and label it in words.
//
// Set JOSE_DEBUG_TYPES=1 to print the documentation stripped from publishable declarations.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'

const SUBPATH_NOTE = /^(?:This|These)\b[^.]*\bexported\b/
const BLOCK_TAG = /^@(\w+)/
const MARKER_TAG = /^@(?:ignore|internal|private|hidden)\s*$/
const PUBLISHED_TAGS = new Set(['param', 'returns', 'throws', 'deprecated'])
const REPORT_STRIPPED = process.env.JOSE_DEBUG_TYPES === '1'
const PRIVATE_DECLARATIONS = `${join('dist', 'types', 'lib')}${sep}`
const COMPOSABLE_DECLARATIONS = `${join('dist', 'types', 'composable')}${sep}`
const PUBLIC_TYPES = join('dist', 'types', 'types.d.ts')
const ALGORITHM_CATALOGS = new Set([
  join('dist', 'types', 'algorithms', 'jws.d.ts'),
  join('dist', 'types', 'algorithms', 'key.d.ts'),
  join('dist', 'types', 'algorithms', 'jwe.d.ts'),
  join('dist', 'types', 'algorithms', 'jwe', 'enc.d.ts'),
  join('dist', 'types', 'algorithms', 'jwe', 'zip.d.ts'),
])
const CATALOG_FACTORY_TYPES = new Map([
  [join('dist', 'types', 'algorithms', 'jws.d.ts'), 'JWSAlgorithmFactory'],
  [join('dist', 'types', 'algorithms', 'key.d.ts'), 'KeyAlgorithmFactory'],
  [join('dist', 'types', 'algorithms', 'jwe.d.ts'), 'JWEKeyManagementFactory'],
  [join('dist', 'types', 'algorithms', 'jwe', 'enc.d.ts'), 'JWEContentEncryptionFactory'],
  [join('dist', 'types', 'algorithms', 'jwe', 'zip.d.ts'), 'JWECompressionFactory'],
])
const ALGORITHM_TYPES = join('dist', 'types', 'algorithms', 'types.d.ts')
const ERROR_TYPES = join('dist', 'types', 'util', 'errors.d.ts')
const REDUNDANT_PARAMETERS = new Set([
  'aad',
  'cek',
  'iv',
  'jwe',
  'jws',
  'jwt',
  'options',
  'parameters',
  'protectedHeader',
  'sharedUnprotectedHeader',
  'unprotectedHeader',
])
/** The five alert types GitHub Flavored Markdown defines. */
const ALERT = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\\?\s*$/
const RELABELLED_ALERT = /^>\s*(?:Note|Tip|Important|Warning|Caution):\s/

/**
 * Splits the text lines of a JSDoc body into paragraphs. Fenced code blocks stay whole, so neither
 * a blank line nor a leading `@` inside one splits a paragraph or reads as a tag.
 */
function paragraphs(lines) {
  const out = []
  let current = []
  let fenced = false

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) fenced = !fenced
    if (!fenced && line.trim() === '') {
      if (current.length) out.push(current)
      current = []
      continue
    }
    current.push(line)
  }
  if (current.length) out.push(current)
  return out
}

/** Splits adjacent block tags so filtering one tag cannot remove a neighboring retained tag. */
function blockTagSections(paragraph) {
  const out = []
  let current = []
  let fenced = false

  for (const line of paragraph) {
    if (!fenced && BLOCK_TAG.test(line) && current.length) {
      out.push(current)
      current = []
    }
    current.push(line)
    if (line.trimStart().startsWith('```')) fenced = !fenced
  }
  if (current.length) out.push(current)
  return out
}

/** Turns `> [!NOTE]\` followed by the quote into a quote that opens with `Note:`. */
function relabelAlert(paragraph) {
  const [marker, ...rest] = paragraph
  const type = marker.trim().match(ALERT)?.[1]
  if (!type || !rest.length) return null

  const label = type.charAt(0) + type.slice(1).toLowerCase()
  return [rest[0].replace(/^(\s*>\s*)/, `$1${label}: `), ...rest.slice(1)]
}

function* declarations(directory) {
  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      yield* declarations(path)
    } else if (entry.name.endsWith('.d.ts')) {
      yield path
    }
  }
}

function transform(lines, drop) {
  const kept = []
  const removed = []
  let changed = false
  let summary = false
  // an @example runs until the next block tag that is not itself an @example - its description and
  // its code fence are separate paragraphs, and there may be several in a row
  let inExample = false
  const sections = paragraphs(lines).flatMap(blockTagSections)

  if (drop || lines.some((line) => /(?:^|\s)@module(?:\s|$)/.test(line))) {
    return { kept, removed: paragraphs(lines), changed: true }
  }

  for (const paragraph of sections) {
    const tag = paragraph[0].match(BLOCK_TAG)?.[1]
    const parameter = tag === 'param' ? paragraph[0].match(/^@param\s+(\w+)/)?.[1] : undefined

    if (tag === 'example') {
      inExample = true
      changed = true
      removed.push(paragraph)
      continue
    }
    if (inExample) {
      if (!tag) {
        changed = true
        removed.push(paragraph)
        continue
      }
      inExample = false
    }
    if (SUBPATH_NOTE.test(paragraph[0]) || MARKER_TAG.test(paragraph[0])) {
      changed = true
      removed.push(paragraph)
      continue
    }
    if (parameter && REDUNDANT_PARAMETERS.has(parameter)) {
      changed = true
      removed.push(paragraph)
      continue
    }

    const relabelled = relabelAlert(paragraph)
    if (relabelled) {
      kept.push(relabelled)
      changed = true
      continue
    }
    if (RELABELLED_ALERT.test(paragraph[0])) {
      kept.push(paragraph)
      continue
    }
    if (tag) {
      if (PUBLISHED_TAGS.has(tag)) {
        const previous = kept.at(-1)
        if (previous && BLOCK_TAG.test(previous[0])) {
          previous.push(...paragraph)
        } else {
          kept.push(paragraph)
        }
      } else {
        changed = true
        removed.push(paragraph)
      }
      continue
    }
    if (!summary) {
      kept.push(paragraph)
      summary = true
    } else {
      changed = true
      removed.push(paragraph)
    }
  }

  return { kept, removed, changed }
}

let touched = 0
const reports = []

for (const file of declarations('dist/types')) {
  const source = readFileSync(file, 'utf8')

  // prettier-plugin-jsdoc puts the summary on the `/**` line when it fits, so both shapes occur
  let updated = source.replace(
    /^([ \t]*)\/\*\*[ \t]?([\s\S]*?)[ \t]*\*\/[ \t]*\n/gm,
    (block, indent, body, offset) => {
      const lines = body.split('\n').map((line) => line.replace(/^[ \t]*\*[ \t]?/, ''))
      while (lines.length && lines.at(-1).trim() === '') lines.pop()

      const following = source.slice(offset + block.length)
      const catalogConstant =
        ALGORITHM_CATALOGS.has(file) && /^export declare const\b/.test(following)
      const repeatedErrorCode =
        file === ERROR_TYPES &&
        /A unique error code for \{@link/.test(body) &&
        !/Each subclass sets its own/.test(body)
      // These repeated shape names make inferred composed types readable, but their summaries only
      // restate the declaration. Result, options, resolver, and other public composability types
      // retain their summaries.
      const composableHelper =
        file.startsWith(COMPOSABLE_DECLARATIONS) &&
        /^export interface \w+(?:Instance|Constructor|Function)\b/.test(following)
      // ConsumeFunction's call signatures are the single source for all eight composed consumer
      // overloads. Their parameter prose belongs in the generated reference, but repeating it in
      // the shared published helper would spend declaration bytes without improving its public
      // hover (the concrete composed function already names all of these types).
      const sharedConsumerOverload =
        file === PUBLIC_TYPES &&
        /^(?:  \(input: Input,|  <Resolved extends ResolvableKey|  \(\n    input: Input,)/.test(
          following,
        )
      const { kept, removed, changed } = transform(
        lines,
        file === ALGORITHM_TYPES ||
          catalogConstant ||
          repeatedErrorCode ||
          composableHelper ||
          sharedConsumerOverload,
      )
      if (!changed) return block

      touched++
      if (REPORT_STRIPPED && removed.length && !file.startsWith(PRIVATE_DECLARATIONS)) {
        const line = source.slice(0, offset).split('\n').length
        const stripped = removed.flatMap((paragraph, index) =>
          index ? ['', ...paragraph] : paragraph,
        )
        reports.push(`${file}:${line}\n${stripped.map((line) => `- ${line}`).join('\n')}`)
      }
      if (!kept.length) return ''

      const flat = kept.flatMap((paragraph, i) => (i ? ['', ...paragraph] : paragraph))
      if (flat.length === 1) return `${indent}/** ${flat[0]} */\n`

      const rendered = flat.map((line) => (line ? `${indent} * ${line}` : `${indent} *`)).join('\n')
      return `${indent}/**\n${rendered}\n${indent} */\n`
    },
  )

  if (ALGORITHM_CATALOGS.has(file)) {
    const factory = CATALOG_FACTORY_TYPES.get(file)
    updated = updated
      .replace(`import type { ${factory} }`, `import type { ${factory} as F }`)
      .replace(new RegExp(`(: )${factory}(?=<)`, 'g'), '$1F')
    updated = updated.replace(
      /^(export declare const [^;\n]+;)(?:\nexport declare const [^;\n]+;)+/gm,
      (block) => {
        const prefix = 'export declare const '
        const lines = block.split('\n')
        return lines
          .map((line, index) => {
            const declaration = index ? `  ${line.slice(prefix.length, -1)}` : line.slice(0, -1)
            return `${declaration}${index === lines.length - 1 ? ';' : ','}`
          })
          .join('\n')
      },
    )
  }

  // Namespace imports only qualify the referenced public type names. A short local alias keeps the
  // same declarations and editor hovers while avoiding repeating `types.` hundreds of times in the
  // published artifact.
  if (/^import type \* as types from /m.test(updated)) {
    updated = updated
      .replace(/^import type \* as types from /m, 'import type * as t from ')
      .replace(/\btypes\.(?=[A-Z])/g, 't.')
  }

  if (updated !== source) writeFileSync(file, updated, 'utf8')
}

if (reports.length) {
  console.log(`stripped published declaration documentation\n\n${reports.join('\n\n')}\n`)
}
console.log(`rewrote ${touched} declaration comment(s) for editor hovers`)
