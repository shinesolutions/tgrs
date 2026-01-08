import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/lambda.ts"],
  format: ["cjs"],
  target: "node24",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  noExternal: [],
  onSuccess: async () => {
    const { copyFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");

    try {
      await mkdir("dist", { recursive: true });

      await copyFile(
        join("src", "schema.graphql"),
        join("dist", "schema.graphql")
      );
      console.log("Copied schema.graphql");
    } catch (error) {
      console.error("post-processing failed:", error);
    }
  },
});
