import { JOSENotSupported } from '../util/errors.ts'

export default function subtleRsaEs(alg: string) {
  switch (alg) {
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      return 'RSA-OAEP'
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}
