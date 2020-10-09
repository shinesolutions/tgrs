module.exports = {
  testEnvironment: "./JestEnvironment",

  // Need to include "js" for source mapping to work
  moduleFileExtensions: ["ts", "js"],

  // Note that the `testEnvironment` specified above will override the value
  // set by this preset. However, the preset adds other settings that we also
  // need.
  preset: "jest-puppeteer",

  testMatch: ["<rootDir>/**/?(*.)test.ts"],

  transform: {
    // TODO Investigate using a Babel transform instead of this transform, as it
    // might reduce the need to duplicate the ts-jest dependency between here
    // and the server
    "^.+\\.tsx?$": "ts-jest",
  },

  setupFilesAfterEnv: ["./setupFileAfterEnv.js"],
};
