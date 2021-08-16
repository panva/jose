const {
  Converter: { EVENT_RESOLVE_BEGIN },
} = require("typedoc");

module.exports.load = function load(app) {
  const gitRevision = app.options.getValue("gitRevision");
  if (gitRevision && gitRevision !== "main") {
    app.converter.on(EVENT_RESOLVE_BEGIN, ({ project: { reflections } }) => {
      for (const key in reflections) {
        const reflection = reflections[key];
        if (reflection.comment && reflection.comment.tags) {
          for (const tag of reflection.comment.tags) {
            tag.text = tag.text.replace(/VERSION/g, gitRevision);
          }
        }
      }
    });
  }
};
