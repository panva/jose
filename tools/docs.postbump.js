require("./explode-exports");
const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const { version } = require("../package.json");
const { sync: glob } = require("glob");

const readme = readFileSync("docs/README.md");
const tagName = `v${version}`;

execSync('find docs -type d | grep "docs/" | xargs rm -r');
writeFileSync(
  "node_modules/typedoc-plugin-markdown/dist/resources/partials/member.sources.hbs",
  readFileSync("tools/member.sources.hbs")
);
writeFileSync(
  "node_modules/typedoc-plugin-markdown/dist/resources/templates/reflection.hbs",
  readFileSync("tools/reflection.hbs")
);
execSync(`npm run docs:generate -- --gitRevision ${tagName}`);
glob("docs/**/*.md").forEach((md) => {
  writeFileSync(
    md,
    readFileSync(md)
      .toString()
      .replace(/```\n\/\//g, "```js\n//")
      .replace(/undefined \\\| /g, '')
  );
});
writeFileSync("docs/README.md", readme);
execSync("git add docs/**/*.md");
