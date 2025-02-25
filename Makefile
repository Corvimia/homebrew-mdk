package: 
	pnpm build
	pnpm bundle
	node --experimental-sea-config sea-config.json
	cp `which node` mdk
	codesign --remove-signature mdk
	npx postject mdk NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
	codesign --sign - mdk
	./mdk version