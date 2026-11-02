export type SetterMethod =
  | 'setIssuer'
  | 'setSubject'
  | 'setAudience'
  | 'setJti'
  | 'setIssuedAt'
  | 'setExpirationTime'
  | 'setNotBefore'

export type SetterValue = string | number | Date | undefined

type Vector = [input: SetterValue, expected?: SetterValue]

export function setters(now: number): [method: SetterMethod, claim: string, vectors: Vector[]][] {
  const timeSetters: Vector[] = [
    [0],
    [new Date(now * 1000), now],
    ['10s', now + 10],
    ['+10s', now + 10],
    ['-10s', now - 10],
    ['+ 10s', now + 10],
    ['- 10s', now - 10],
    ['10s from now', now + 10],
    ['10s ago', now - 10],
  ]

  return [
    ['setIssuer', 'iss', [['urn:example:issuer']]],
    ['setSubject', 'sub', [['urn:example:subject']]],
    ['setAudience', 'aud', [['urn:example:audience']]],
    ['setJti', 'jti', [['urn:example:jti']]],
    ['setIssuedAt', 'iat', [[undefined, now], ...timeSetters]],
    ['setExpirationTime', 'exp', timeSetters],
    ['setNotBefore', 'nbf', timeSetters],
  ]
}
