const { readFileSync, writeFileSync, unlinkSync } = require("fs");

const pkg = JSON.parse(readFileSync("./package.json"));
delete pkg.devDependencies;
delete pkg.scripts;
delete pkg.imports;

pkg.description = `(Node.JS ESM Runtime) ${pkg.description}`;

delete pkg.browser;
delete pkg.exports["."].browser;
delete pkg.exports["."].require;
pkg.main = pkg.exports["."].import;

const deletedKeywords = new Set([
  "browser",
  "cloudflare",
  "deno",
  "isomorphic",
  "universal",
  "webcrypto",
  "workers",
]);
pkg.keywords = pkg.keywords.filter((keyword) => {
  return !deletedKeywords.has(keyword);
});

pkg.files.push("!dist/browser/**/*");
pkg.files.push("!dist/node/cjs/**/*");
pkg.files.push("!dist/**/package.json");

pkg.name = "jose-node-esm-runtime";
pkg.type = "module";

writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
writeFileSync(
  "./README.md",
  `# jose

> ${pkg.description} using the Node.js \`crypto\` module.

⚠️ This distribution only supports the Node.js runtime.
Its purpose is to offer a distribution of \`jose\` with a smaller bundle/install
size. It is an ECMAScript Module (ESM).

For the universal module see [npmjs.com/package/jose](https://www.npmjs.com/package/jose)

## Support

If you or your business use \`jose\`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Install

\`\`\`console
npm install ${pkg.name}
\`\`\`

## Documentation

See [${pkg.homepage.replace("https://", "")}](${pkg.homepage})

[support-sponsor]: https://github.com/sponsors/panva
`
);
unlinkSync("./CHANGELOG.md");
