import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    {
        ignores: ["node_modules/**", ".next/**", "dist/**", "build/**"]
    },
    ...tseslint.configs.recommended,
    {
        files: ["app/**/*.{js,jsx,ts,tsx}"],
        extends: [
            ...compat.extends("eslint:recommended"),
            // ...compat.extends("next/core-web-vitals")
        ],
        plugins: {
            "@next/next": nextPlugin
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            // ecmaVersion: 2020,
            // sourceType: "module",
            // ecmaFeatures: {
            //         jsx: true
            //     }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "@typescript-eslint/no-unused-vars": "warn"
        },
    }]);