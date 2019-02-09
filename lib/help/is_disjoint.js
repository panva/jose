module.exports = (a = {}, b = {}) => {
  const keysA = Object.keys(a)
  const keysB = new Set(Object.keys(b))
  return !keysA.some((ka) => keysB.has(ka))
}
