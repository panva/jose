function isObjectLike(value: unknown) {
  return typeof value === 'object' && value !== null
}

export default function isObject(input: unknown): boolean {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(input) === null) {
    return true
  }
  let proto = input
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(input) === proto
}
