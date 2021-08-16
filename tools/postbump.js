const { x } = require("tar");

require("./explode-exports");
const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const { version } = require("../package.json");

const readme = readFileSync("docs/README.md");
const tagName = `v${version}`;
const opts = { stdio: "inherit" };

execSync("git rm -f docs/**/*.md", opts);
execSync('find docs -type d | grep "docs/" | xargs rm -rf', opts);
execSync(
  `npm run docs:generate -- --plugin ./tools/typedoc-replace-version --gitRevision ${tagName}`,
  opts
);
writeFileSync("docs/README.md", readme);
execSync("git add docs/**/*.md", opts);
execSync("npm pack", opts);

x({
  f: `jose-${version}.tgz`,
  strip: true,
  filter(loc) {
    return loc.startsWith("package/dist/");
  },
  sync: true,
});
execSync("npm run build:deno", opts);
execSync("git add dist/**/* -f", opts);
