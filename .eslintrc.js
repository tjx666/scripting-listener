const { resolve } = require;

const OFF = 0;
const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:unicorn/recommended',
        'prettier',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 13,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.ts', '.tsx', '.js', '.json'],
            },
            typescript: {
                project: [
                    resolve('./src/tsconfig.json'),
                    resolve('./scripts/tsconfig.json'),
                    resolve('./test/tsconfig.json'),
                    resolve('./web/tsconfig.json'),
                ],
            },
        },
    },
    rules: {
        '@typescript-eslint/ban-ts-comment': OFF,
        '@typescript-eslint/no-empty-function': OFF,
        '@typescript-eslint/no-empty-interface': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-non-null-assertion': OFF,
        '@typescript-eslint/no-unused-vars': OFF,
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/ban-types': OFF,

        'unicorn/consistent-function-scoping': OFF,
        'unicorn/filename-case': OFF,
        'unicorn/import-style': OFF,
        'unicorn/no-abusive-eslint-disable': OFF,
        'unicorn/no-array-for-each': OFF,
        'unicorn/no-null': OFF,
        'unicorn/no-process-exit': OFF,
        'unicorn/prefer-module': OFF,
        'unicorn/prefer-node-protocol': OFF,
        'unicorn/prevent-abbreviations': OFF,
        'unicorn/text-encoding-identifier-case': OFF,

        'func-names': OFF,
        'max-classes-per-file': OFF,
        'no-bitwise': OFF,
        'no-console': OFF,
        'no-param-reassign': OFF,
        'no-plusplus': OFF,
        'no-unused-expressions': OFF,

        'import/extensions': OFF,

        'react/self-closing-comp': [
            ERROR,
            {
                component: true,
                html: true,
            },
        ],
    },
    overrides: [
        {
            files: ['test/**/*.ts'],
            rules: {
                'import/prefer-default-export': OFF,
            },
        },
        {
            files: ['scripts/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': OFF,
            },
        },
    ],
};
