/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */

const isDisjoint = (...headers: Array<object | undefined>) => {
  const sources = headers.filter(Boolean) as Array<object>

  if (sources.length === 0 || sources.length === 1) {
    return true
  }

  let acc!: Set<string>
  for (const header of sources) {
    const parameters = Object.keys(header)
    if (!acc || acc.size === 0) {
      acc = new Set(parameters)
      continue
    }

    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false
      }
      acc.add(parameter)
    }
  }

  return true
}
export default isDisjoint
