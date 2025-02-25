# Homebrew Formula for mdk (Mia's Dev Kit)
#
# How to use:
# 1. After creating a GitHub release, get the SHA256 with:
#    curl -L https://github.com/Corvimia/mdk/archive/refs/tags/v0.0.1.tar.gz | shasum -a 256
# 2. Update the sha256 value below with the actual checksum
#
class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/archive/refs/tags/v0.0.1.tar.gz"
  sha256 "9234c552e783544ae4e8fba30324299cab07c2c6d3812fe1fa8fc4c1fb3a472b"
  license "ISC"

  depends_on "node"
  depends_on "pnpm"

  def install
    system "pnpm", "install"
    system "make", "package"
    bin.install "mdk"
  end

  test do
    assert_match "0.0.1", shell_output("#{bin}/mdk version")
  end
end 