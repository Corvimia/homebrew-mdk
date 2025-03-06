#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  name: string;
  version: string;
  description: string;
  [key: string]: any;
}

interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

// Read the package.json file
const packageJsonPath: string = path.join(__dirname, '..', 'package.json');
const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Create a simplified version for embedding
const packageInfo: PackageInfo = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description
};

// Create a JavaScript module that exports this info
const tsContent: string = `// This file is auto-generated - do not edit
// It contains embedded package info for the SEA build

// Package info embedded during build
const packageInfo = ${JSON.stringify(packageInfo, null, 2)};

export const getPackageInfo = (): PackageInfo => packageInfo;

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
`;

// Ensure src directory exists
const generatedFilePath: string = path.join(__dirname, '..', 'src', 'generated-package-info.ts');
fs.writeFileSync(generatedFilePath, tsContent);

console.log(`Package info prepared for bundling: ${generatedFilePath}`); 