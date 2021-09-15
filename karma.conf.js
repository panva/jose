const reporters = ["summary"];

if (!('CI' in process.env)) {
  reporters.push("progress");
}

const browsers = {
  chrome_latest: {
    base: "BrowserStack",
    browser: "chrome",
    os: "Windows",
    os_version: "10",
  },
  chrome_lowest: {
    base: "BrowserStack",
    browser: "chrome",
    os: "Windows",
    browser_version: "63.0",
    os_version: "10",
  },
  firefox_latest: {
    base: "BrowserStack",
    browser: "firefox",
    os: "Windows",
    os_version: "10",
  },
  firefox_lowest: {
    base: "BrowserStack",
    browser: "firefox",
    os: "Windows",
    browser_version: "57.0",
    os_version: "10",
  },
  edge_latest: {
    base: "BrowserStack",
    browser: "edge",
    os: "Windows",
    os_version: "10",
  },
  edge_lowest: {
    base: "BrowserStack",
    browser: "edge",
    os: "Windows",
    browser_version: "80.0",
    os_version: "10",
  },
  opera_latest: {
    base: "BrowserStack",
    browser: "opera",
    os: "Windows",
    os_version: "10",
  },
  opera_lowest: {
    base: "BrowserStack",
    browser: "opera",
    os: "Windows",
    browser_version: "50.0",
    os_version: "10",
  },
  safari_latest: {
    base: "BrowserStack",
    browser: "safari",
    os: "OS X",
    os_version: "Catalina",
  },
  safari_lowest: {
    base: "BrowserStack",
    browser: "safari",
    os: "OS X",
    os_version: "High Sierra",
  },
  ios_latest: {
    base: "BrowserStack",
    device: "iPhone 12 Pro",
    os: "ios",
    real_mobile: true,
    os_version: "14",
  },
  ios_lowest: {
    base: "BrowserStack",
    device: "iPhone XS Max",
    os: "ios",
    real_mobile: true,
    os_version: "12",
  },
  android_latest: {
    base: "BrowserStack",
    device: "Google Pixel 4",
    os: "android",
    real_mobile: true,
    os_version: "11.0",
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
