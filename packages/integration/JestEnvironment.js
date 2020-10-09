// Jest environment files have to be JavaScript. However, we can use bootstrap
// a TypeScript interpreter inside the file and do everything else with
// TypeScript.
require("ts-node").register();
const { JestEnvironment } = require("./JestEnvironment.ts");

module.exports = JestEnvironment;
