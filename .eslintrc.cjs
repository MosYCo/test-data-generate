module.exports = {
      env: {
        browser: true,
        es2021: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: ['react', '@typescript-eslint', 'react-hooks'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': [
          'error',
          {
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
            bracketSpacing: true,
            arrowParens: 'always',
            endOfLine: 'lf',
          },
        ],
      },
    };
