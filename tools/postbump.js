const { x } = require("tar");

const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const { version } = require("../package.json");

const readme = readFileSync("docs/README.md");
const tagName = `v${version}`;
const opts = { stdio: "inherit" };

execSync("git rm -f docs/**/*.md", opts);
execSync('find docs -type d | grep "docs/" | xargs rm -rf', opts);
execSync("npx patch-package", opts);
execSync(
  `npm run docs:generate -- --plugin ./tools/typedoc-replace-version --gitRevision ${tagName}`,
  opts
);
writeFileSync("docs/README.md", readme);
execSync("npm pack", opts);
execSync("rm -rf dist", opts);
x({
  f: `jose-${version}.tgz`,
  strip: true,
  filter(loc) {
    return loc.startsWith("package/dist/");
  },
  sync: true,
});
execSync("npm run build:deno", opts);
execSync("cp docs/README.md dist/deno/README.md");
execSync(
  `sed -i '' -e 's/](/](https:\\/\\/github.com\\/panva\\/jose\\/blob\\/${tagName}\\/docs\\//g' dist/deno/README.md`
);
execSync("git add docs/**/*.md", opts);
execSync("git add dist/**/* -f", opts);
