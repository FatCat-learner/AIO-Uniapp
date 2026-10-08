// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default defineConfig(
  // [1] 忽略编译产物和静态资源
  {
    ignores: [
      'dist/**',
      'unpackage/**',
      'node_modules/**',
      'static/**',
      'commitlint.config.cjs', // 新增
      '.eslintrc.*',
      'eslint.config.mjs',
      'vitest.config.ts',
      'vite.config.ts',
    ],
  },

  // [2] JS 基础规则 + uni-app 全局变量
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        uni: 'readonly',
        wx: 'readonly',
        plus: 'readonly',
        getCurrentPages: 'readonly',
      },
    },
  },

  // [3] TypeScript 强类型支持
  ...tseslint.configs.recommended,

  // [4] Vue 3 核心规范
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off', // uni-app 页面名通常为单词
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 3 },
          multiline: { max: 1 },
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // [5] Prettier 冲突处理：必须放在最后一行
  pluginPrettierRecommended,
)
