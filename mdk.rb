# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v0.0.1/mdk-v0.0.1.tar.gz"
  sha256 "d3b33ade0b9359543fa4d4d4cc5bf39eef382e78a72ad780a59df905210df1c2"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "0.0.1", shell_output("#{bin}/mdk version")
  end
end 