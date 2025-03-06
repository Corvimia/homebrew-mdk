# frozen_string_literal: true
# typed: true

# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v0.2.4/mdk-v0.2.4.tar.gz"
  sha256 "d970dc2ee75042b89221910c85b749d86b7ded7641d9506a94b6e8733cb981cb"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "0.2.4", shell_output("#{bin}/mdk version")
  end
end
