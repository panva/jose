export default function isObject(input: unknown): boolean {
  return typeof input === 'object' && !!input && input.constructor === Object
}
