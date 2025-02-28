package: 
	. $(HOME)/.nvm/nvm.sh && nvm use && node scripts/prepare-package-info.js
	. $(HOME)/.nvm/nvm.sh && nvm use && pnpm build
	. $(HOME)/.nvm/nvm.sh && nvm use && pnpm bundle
	. $(HOME)/.nvm/nvm.sh && nvm use && node --experimental-sea-config sea-config.json
	cp $(shell command -v node) mdk
	codesign --remove-signature mdk
	. $(HOME)/.nvm/nvm.sh && nvm use && npx postject mdk NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
	codesign --sign - mdk
	./mdk version
	tar -czf mdk-v0.0.1.tar.gz mdk
	shasum -a 256 mdk-v0.0.1.tar.gz
