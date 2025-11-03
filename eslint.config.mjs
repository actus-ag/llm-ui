import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import preferArrow from "eslint-plugin-prefer-arrow";
import fastGlob from "fast-glob";
import globals from "globals";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageSvelte = "packages/svelte";
const packageMarkdown = "packages/markdown";
const packageCode = "packages/code";
const packageSvelteCode = "packages/svelte-code";

const typescriptProjects = [
  packageSvelte,
  packageMarkdown,
  packageCode,
  packageSvelteCode,
];

const foldersToLint = fastGlob.sync([`packages/*`, `tooling/*`], {
  onlyDirectories: true,
  ignore: ["tooling/tsconfig"],
});

const missingInConfig = foldersToLint.filter(
  (f) => !typescriptProjects.includes(f),
);

if (missingInConfig.length > 0) {
  throw new Error(`Missing in eslint config: ${missingInConfig.join(",")}`);
}

export default [
  {
    ignores: [
      `packages/*/dist/**/*`,
      `examples/*/dist/**/*`,
      `**/*.d.ts`,
      `**/vite.config.ts`,
      `**/tsup.config.ts`,
    ],
  },
  ...typescriptProjects.map((project) => ({
    files: [`${project}/**/*.{ts,tsx}`],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: `${project}/tsconfig.json`,
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    rules: {
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs["recommended"].rules,
    },
  })),
  {
    files: [`${packageSvelte}/**/*.{js,mjs,cjs,ts,tsx}`],
    ...js.configs.recommended,
    plugins: {
      "prefer-arrow": preferArrow,
      ...js.configs.recommended.plugins,
    },
    rules: {
      "prefer-arrow-callback": "error",
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
    },
  },
];
