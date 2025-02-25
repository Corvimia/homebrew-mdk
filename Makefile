package: 
	pnpm build
	pnpm bundle
	node --experimental-sea-config sea-config.json
	cp $(shell command -v node) mdk
	codesign --remove-signature mdk
	npx postject mdk NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
	codesign --sign - mdk
	./mdk version
	tar -czf mdk-v0.0.1.tar.gz mdk
	shasum -a 256 mdk-v0.0.1.tar.gz
