const curves = new Set(['Ed25519'])

if (!('electron' in process.versions)) {
  curves.add('Ed448')
  curves.add('X25519')
  curves.add('X448')
}

module.exports = curves
