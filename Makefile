.PHONY: package build sign bundle create-package update-formula release

# Main packaging target that runs the full process
package: build sign create-package update-formula

# Extract version information from package.json
define get-version
$(shell node -p "require('./package.json').version")
endef

# Update version and create a new package
# Usage: 
#   make release         (updates minor version)
#   make release V=patch (updates patch version)
#   make release V=major (updates major version)
release:
	@echo "Updating version..."
	$(eval VERSION_TYPE := $(if $(V),$(V),minor))
	@echo "Version update type: $(VERSION_TYPE)"
	pnpm tsx scripts/update-version.ts $(VERSION_TYPE)
	@$(MAKE) package

# Build the application
build:
	@echo "Building package for version $(call get-version)"
	pnpm tsx scripts/prepare-package-info.ts
	pnpm build
	pnpm bundle
	node --experimental-sea-config sea-config.json

# Code sign the binary
sign: build
	cp $(shell command -v node) mdk
	codesign --remove-signature mdk
	npx postject mdk NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
	codesign --sign - mdk
	./mdk version

# Create the package with the binary
create-package: sign
	$(eval VERSION := $(call get-version))
	tar -czf mdk-v$(VERSION).tar.gz mdk

# Update the formula file with new version and hash
update-formula: create-package
	$(eval VERSION := $(call get-version))
	$(eval HASH := $(shell shasum -a 256 mdk-v$(VERSION).tar.gz | cut -d ' ' -f 1))
	@echo "New SHA256: $(HASH)"
	@echo "Updating formula with version $(VERSION) and SHA256 $(HASH)"
	pnpm tsx scripts/update-formula.ts "$(VERSION)" "$(HASH)"
	