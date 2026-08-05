import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-tabs': 'error',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
