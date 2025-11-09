/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".spec.ts$",
  // Load environment variables before tests run
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  setupFilesAfterEnv: [],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.generated.ts"],
  coverageReporters: ["json"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
