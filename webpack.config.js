const path = require("path");
const { sync: glob } = require("glob");

module.exports = {
  entry: glob("test-browser/*.js").reduce((acc, x) => {
    acc[x.slice(13, -3)] = `./${x}`;
    return acc;
  }, {}),
  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist-browser-tests"),
  },
};
