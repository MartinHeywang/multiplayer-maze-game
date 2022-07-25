import esbuild from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files";

esbuild.build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    bundle: true,
    minify: true,
    sourcemap: false,
    watch: false,
    platform: "node",
    plugins: [
        copyStaticFiles({
            src: "./src/labyrinths/",
            dest: "./dist/",
        }),
    ],
});
