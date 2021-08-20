const { readFileSync, writeFileSync, unlinkSync } = require("fs");

const pkg = JSON.parse(readFileSync("./package.json"));
delete pkg.devDependencies;
delete pkg.scripts;
delete pkg.imports;

pkg.description = pkg.description.replace("Universal ", "(Browser Runtime) ");

for (const exportPath of Object.keys(pkg.exports)) {
  if (exportPath.startsWith("./webcrypto")) {
    delete pkg.exports[exportPath];
  } else if (
    typeof pkg.exports[exportPath] === "object" &&
    "browser" in pkg.exports[exportPath]
  ) {
    pkg.exports[exportPath] = pkg.exports[exportPath].browser;
  }
}
delete pkg.typesVersions["*"]["webcrypto/*"];

const deletedKeywords = new Set([
  "deno",
  "eddsa",
  "electron",
  "isomorphic",
  "okp",
  "secp256k1",
  "universal",
]);
pkg.keywords = pkg.keywords.filter((keyword) => {
  return !deletedKeywords.has(keyword);
});

pkg.files.push("!dist/node/**/*");
pkg.files.push("!dist/**/package.json");

pkg.name = "jose-browser-runtime";
pkg.type = "module";

writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
writeFileSync(
  "./README.md",
  `# jose

> ${pkg.description} using Web Cryptography API.

⚠️ This distribution only supports the Browser runtime.
Its purpose is to offer a distribution of \`jose\` with a smaller bundle/install
size before tree-shaking.

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
