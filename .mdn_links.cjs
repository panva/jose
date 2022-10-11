const doms = new Set([
  'URL',
])

module.exports.load = function load(app) {
  app.renderer.addUnknownSymbolResolver('typescript', (name) => {
    if (doms.has(name)) {
      return `https://developer.mozilla.org/en-US/docs/Web/API/${name}`
    }
  })
}
