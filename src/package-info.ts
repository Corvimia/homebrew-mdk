// This file contains package.json information that can be embedded in the SEA blob
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import * as path from 'path';

// During development, read from actual package.json
// In production SEA build, this will be replaced with the embedded version
let packageInfo: { version: string, name: string, description: string };

try {
  // For development mode - using __dirname for CommonJS compatibility
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  packageInfo = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
} catch (error) {
  // For production SEA build, this data will be replaced during bundling
  packageInfo = {
    name: "mdk",
    version: "0.0.1",
    description: "Mia's Dev Kit"
  };
}

export const getPackageInfo = () => packageInfo; 