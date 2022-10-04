const reporters = ["summary"];

if (!('CI' in process.env)) {
  reporters.push("progress");
}

const browsers = {
  chrome_latest: {
    base: "BrowserStack",
    browser: "chrome",
    os: "Windows",
    os_version: "11",
  },
  firefox_latest: {
    base: "BrowserStack",
    browser: "firefox",
    os: "Windows",
    os_version: "11",
  },
  edge_latest: {
    base: "BrowserStack",
    browser: "edge",
    os: "Windows",
    os_version: "11",
  },
  safari_latest: {
    base: "BrowserStack",
    browser: "safari",
    os: "OS X",
    os_version: "Monterey",
  },
};

module.exports = function (config) {
  config.set({
    basePath: "",
    hostname: "127.0.0.1",
    frameworks: ["qunit"],
    plugins: [
      "karma-qunit",
      "karma-browserstack-launcher",
      "karma-summary-reporter",
    ],
    files: ["dist-browser-tests/*.js"],
    reporters,
    port: 9876,
    autoWatch: false,
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },
    customLaunchers: browsers,
    logLevel: config.LOG_WARN,
    client: {
      qunit: {
        showUI: true,
        testTimeout: 5000,
        hidepassed: true
      },
    },
    browsers: Object.keys(browsers),
    singleRun: true,
    retryLimit: 0,
    summaryReporter: {
      show: 'all',
      overviewColumn: true,
      browserList: 'always'
    }
  });
};
