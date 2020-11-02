export default function isObject(input: any): boolean {
  return !!input && input.constructor === Object
}
