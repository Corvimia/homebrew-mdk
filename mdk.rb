# frozen_string_literal: true
# typed: true

# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v0.2.0/mdk-v0.2.0.tar.gz"
  sha256 "76ac4ef58c33f63820b6c9f8cc83b4a0be26964d3ca68b2afb508111ca3869a3"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "0.2.0", shell_output("#{bin}/mdk version")
  end
end
