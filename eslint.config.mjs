// eslint.config.mjs
import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// Базовая конфигурация Next.js (включает core-web-vitals и typescript)
import nextConfig from "eslint-config-next";

const eslintConfig = defineConfig(
  {
    // Включаем все правила из Next.js
    ...nextConfig,

    // Переопределяем только то, что нам нужно
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      // ВЫКЛЮЧАЕМ no-explicit-any — НАВСЕГДА
      "@typescript-eslint/no-explicit-any": "off",

      // Дополнительно — убираем ещё пару раздражающих правил на время защиты
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/exhaustive-deps": "warn", // вместо error — чтобы не падало

      // Если хочешь быть совсем спокойной — можно ещё:
      // "no-console": "off",
    },

    // Игнорируем файлы, которые не нужно линтить
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "**/*.d.ts",
    ],
  }
);

export default eslintConfig;