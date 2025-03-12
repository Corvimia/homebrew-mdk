# frozen_string_literal: true
# typed: true

# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v0.3.0/mdk-v0.3.0.tar.gz"
  sha256 "cc33cc3f27a8b0b374cbbfe558dcba961c1ab68080eb4887f9e6615920e7308b"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "0.3.0", shell_output("#{bin}/mdk version")
  end
end
