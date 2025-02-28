#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Create a simplified version for embedding
const packageInfo = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description
};

// Create a JavaScript module that exports this info
const jsContent = `// This file is auto-generated - do not edit
// It contains embedded package info for the SEA build

// Package info embedded during build
const packageInfo = ${JSON.stringify(packageInfo, null, 2)};

export const getPackageInfo = () => packageInfo;
`;

// Ensure src directory exists
const generatedFilePath = path.join(__dirname, '..', 'src', 'generated-package-info.ts');
fs.writeFileSync(generatedFilePath, jsContent);

console.log(`Package info prepared for bundling: ${generatedFilePath}`); 