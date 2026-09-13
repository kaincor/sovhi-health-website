import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Figma Dev Mode exports. Reference material, never compiled or imported.
    // The export is not valid JSX (it emits style="..." strings on spans), so
    // linting it only produces noise.
    "design/**",
  ]),
]);

export default eslintConfig;
