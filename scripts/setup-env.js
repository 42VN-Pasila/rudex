#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");

const nodeEnv = (process.env.NODE_ENV || "development").toLowerCase();

const map = {
  development: ".env.dev",
  dev: ".env.dev",
  test: ".env.test",
  production: ".env.prod",
  prod: ".env.prod",
};

const sourceFile = map[nodeEnv];
if (!sourceFile) {
  console.error(`Unsupported environment '${nodeEnv}'.`);
  process.exit(1);
}

const root = process.cwd();
const srcPath = path.join(root, sourceFile);
if (!fs.existsSync(srcPath)) {
  console.error(`Source env file '${sourceFile}' not found at ${srcPath}`);
  process.exit(1);
}

const targetRootEnv = path.join(root, ".env");
try {
  fs.copyFileSync(srcPath, targetRootEnv);
  console.log(
    `Environment '${nodeEnv}' loaded from '${sourceFile}'. Generated .env file.`,
  );
} catch (e) {
  console.error("Failed to setup environment files:", e);
  process.exit(1);
}
