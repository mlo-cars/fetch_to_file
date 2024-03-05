import esbuild from "esbuild";

const buildTarget = "es2017";

const buildConfig = {
  format: "esm",
  target: buildTarget,
  entryPoints: ["./src/fetchTableauUsers.js", "./src/verifyDotyAwards.js"],
  outdir: "./dist",
  bundle: true,
  platform: "node",
};

const performBuild = async () => {
  await esbuild.build(buildConfig);
};

await performBuild();
