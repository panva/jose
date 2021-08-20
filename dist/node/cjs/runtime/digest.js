"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const digest = (algorithm, data) => crypto_1.createHash(algorithm).update(data).digest();
exports.default = digest;
