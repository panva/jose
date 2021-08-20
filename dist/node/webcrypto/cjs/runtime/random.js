"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webcrypto_js_1 = require("./webcrypto.js");
const random = webcrypto_js_1.default.getRandomValues.bind(webcrypto_js_1.default);
exports.default = random;
