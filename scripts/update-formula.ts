import * as fs from 'fs';

/**
 * Updates the mdk.rb Homebrew formula file with the provided version and SHA256 hash
 */
function updateFormula(version: string, hash: string): void {
  const content = `# frozen_string_literal: true
# typed: true

# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v${version}/mdk-v${version}.tar.gz"
  sha256 "${hash}"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "${version}", shell_output("\#{bin}/mdk version")
  end
end
`;

  fs.writeFileSync('mdk.rb', content);
  console.log(`Successfully updated mdk.rb with:`);
  console.log(`- Version: ${version}`);
  console.log(`- SHA256: ${hash}`);
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: npx tsx scripts/update-formula.ts <version> <hash>');
  process.exit(1);
}

const [version, hash] = args;
updateFormula(version, hash); 