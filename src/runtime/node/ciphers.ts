import { getCiphers } from 'node:crypto'

let ciphers: Set<string>

export default (algorithm: string) => {
  ciphers ||= new Set(getCiphers())
  return ciphers.has(algorithm)
}
