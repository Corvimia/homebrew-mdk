import * as fs from 'fs';
import * as path from 'path';

// Default to minor if no version type is specified
const versionType = process.argv[2] || 'minor';

// Validate version type
if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('Invalid version type. Use major, minor, or patch.');
  process.exit(1);
}

// Read the package.json file
const packageJsonPath = path.resolve('./package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Parse current version
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// Update version based on specified type
let newVersion: string;
if (versionType === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (versionType === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else {
  // patch
  newVersion = `${major}.${minor}.${patch + 1}`;
}

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Updated version from ${major}.${minor}.${patch} to ${newVersion}`); 