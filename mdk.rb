# frozen_string_literal: true
# typed: true

# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v0.0.1/mdk-v0.0.1.tar.gz"
  sha256 "0b57f6fe283e48cf9e9ba3408b49dcbe1f6237158281810bb8f7ea85c8657b17"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "0.0.1", shell_output("#{bin}/mdk version")
  end
end
