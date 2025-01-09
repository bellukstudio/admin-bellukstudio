import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change unused vars to a warning
      "@typescript-eslint/no-explicit-any": "off", // Disable explicit any rule
      "react-hooks/exhaustive-deps": "warn",       // Change missing deps to a warning
    },
  },
];

export default eslintConfig;
