# Homebrew Formula for mdk (Mia's Dev Kit)

class Mdk < Formula
  desc "Mia's Dev Kit"
  homepage "https://github.com/Corvimia/mdk"
  url "https://github.com/Corvimia/mdk/releases/download/v0.0.1/mdk-v0.0.1.tar.gz"
  sha256 "0793cb02bf5bed94967716896d3ae1bdf9430bc6015f967625e5a1f1f14dfe25"
  license "ISC"

  def install
    bin.install "mdk"
  end

  test do
    assert_match "0.0.1", shell_output("#{bin}/mdk version")
  end
end 