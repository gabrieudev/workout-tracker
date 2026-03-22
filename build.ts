await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./build",
	target: "bun",
	compile: {
		target: "bun-linux-x64",
		outfile: "server",
	},
	minify: true,
	sourcemap: "linked",
});

export {};
