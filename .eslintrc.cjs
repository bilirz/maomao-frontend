module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // TypeScript 解析器
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'vue',
    '@typescript-eslint', // TypeScript
    'prettier', // 启用 Prettier 插件
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': 'error', // 确保代码风格一致性
  },
  globals: {
    ElNotification: 'readonly',
    ElMessage: 'readonly',
  },
}
