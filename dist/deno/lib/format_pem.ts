export default (b64: string, descriptor: string) => {
  const newlined = (b64.match(/.{1,64}/g) || []).join('\n')
  return `-----BEGIN ${descriptor}-----\n${newlined}\n-----END ${descriptor}-----`
}
