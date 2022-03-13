module.exports = {
    'JSX/**/*.jsx': 'eslint -c ./JSX/.eslintrc.js',
    'src/**/*.{js,ts,tsx}': 'eslint -c .eslintrc.js',
    '*.{js,jsx,ts,tsx,json,css,less,scss,md,xml}': 'prettier --write',
    'src/**/*.ts?(x)': () => 'tsc -p ./src/tsconfig.json --noEmit',
};
