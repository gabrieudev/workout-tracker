await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./build",
	target: "bun",
	compile: {
		target: "bun-linux-arm64",
		outfile: "server",
	},
	minify: true,
	sourcemap: "linked",
});

export {};
