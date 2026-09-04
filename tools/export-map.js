/** Resolves an exact or wildcard package export for one concrete subpath. */
export function resolvePackageExport(exportsMap, subpath) {
  if (Object.hasOwn(exportsMap, subpath)) return exportsMap[subpath]

  let match
  for (const [pattern, target] of Object.entries(exportsMap)) {
    const wildcard = pattern.indexOf('*')
    if (wildcard === -1) continue

    const prefix = pattern.slice(0, wildcard)
    const suffix = pattern.slice(wildcard + 1)
    if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue

    if (
      match &&
      (match.prefix.length > prefix.length ||
        (match.prefix.length === prefix.length && match.pattern.length >= pattern.length))
    ) {
      continue
    }
    match = { pattern, prefix, suffix, target }
  }
  if (!match) return undefined

  const replacement = subpath.slice(match.prefix.length, subpath.length - match.suffix.length)
  if (match.target === null || typeof match.target === 'string') {
    return typeof match.target === 'string' ? match.target.replace('*', replacement) : null
  }
  return Object.fromEntries(
    Object.entries(match.target).map(([condition, target]) => [
      condition,
      typeof target === 'string' ? target.replace('*', replacement) : target,
    ]),
  )
}

/** Maps one JSR source export to its corresponding emitted npm target. */
export function emittedTarget(source, kind) {
  const stem = source.replace(/^\.\/src\//u, '').replace(/\.ts$/u, '')
  return kind === 'types' ? `./dist/types/${stem}.d.ts` : `./dist/webapi/${stem}.js`
}
